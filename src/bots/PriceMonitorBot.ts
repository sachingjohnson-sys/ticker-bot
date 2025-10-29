import { ThresholdPriceChecker } from "../services/domain-service/threshold-price-checker.service.js"
import { TickerService } from "../services/data-service/ticker.service.js";
import { ConsoleLoggerSubscriber } from "../infrastructure/logger/subscribers/ConsoleLogger.js";
import { ObservableLogger } from "../infrastructure/logger/ObservableLogger.js";

import { BOT_CONFIG } from "../config/app.config.js";
import { TickerDAO } from "../infrastructure/dao/ticker.dao.js";
import { BotConfigDAO } from "../infrastructure/dao/botConfig.dao.js";
import { ConfigService } from "../services/data-service/config.service.js";
import { AlertDAO } from "../infrastructure/dao/alert.dao.js";
import { AlertService } from "../services/data-service/alert.service.js";
import { FileLoggerSubscriber, initLogFile } from "../infrastructure/logger/subscribers/FileLogger.js";

const tickerService = new TickerService(new TickerDAO());
const botConfigService = new ConfigService(new BotConfigDAO());
const alertService = new AlertService(new AlertDAO);
const thresholdPriceChecker = new ThresholdPriceChecker();

const observableLogger = new ObservableLogger();
observableLogger.subscribe(ConsoleLoggerSubscriber);

await initLogFile();
observableLogger.subscribe(FileLoggerSubscriber);

export async function startMonitoring() {
  // Wrap each interval in a Promise that resolves when it's done
  const intervalPromises = BOT_CONFIG.map((config) => {
    return new Promise<void>(async (resolve) => {
        let configId: number;
        try {
            configId = await botConfigService.saveConfig(config.botId, config.pair, config.interval, config.threshold);
        } catch (err) {
            console.error(`Failed to save bot config for ${config.pair}:`, err);
            resolve();
            return;
        }

        let pendingTasks: Promise<void>[] = [];
        let intervalActive = true;
        const intervalId = setInterval(async () => {
            const task = (async () => {
                try {
                const tickerAPIResponse = await tickerService.fetchTickers(config.pair.toUpperCase());
                if (!tickerAPIResponse) {
                    console.error(
                    `Ticker not found for ${config.pair.toUpperCase()} ${config.interval} ${config.threshold}`
                    );
                    clearInterval(intervalId);
                    intervalActive = false;
                    if (pendingTasks.length === 0) resolve();
                    return;
                }

                const bidPrice = tickerAPIResponse.bid;
                const askPrice = tickerAPIResponse.ask;
                const tickerId = await tickerService.saveTicker(config.pair.toUpperCase(), bidPrice, askPrice, tickerAPIResponse.currency, configId);

                const isAlert = thresholdPriceChecker.check(config.pair.toUpperCase(), bidPrice, config.threshold);

                if (isAlert.triggered) {
                    const timestamp = new Date();
                    await alertService.saveAlert(tickerId, configId, isAlert.changePerc, timestamp);
                    observableLogger.log(
                    `[${timestamp.toISOString()}] : Alert for pair: ${config.pair}, bid: ${bidPrice}, threshold: ${config.threshold}, rate: ${isAlert.changePerc}`
                    );
                }
                } catch (err) {
                    console.error("Error in monitoring interval:", err);
                    clearInterval(intervalId);
                    intervalActive = false;
                    if (pendingTasks.length === 0) resolve();
                    return;
                }
            })();
            pendingTasks.push(task);
            task.finally(() => {
                const index = pendingTasks.indexOf(task);
                if (index > -1) pendingTasks.splice(index, 1);
                if (!intervalActive && pendingTasks.length === 0) resolve();
            });
        }, config.interval);

        // Stop the interval after stopAfter (if provided) and resolve the promise
        if (config.stopAfter) {
            setTimeout(async() => {
                clearInterval(intervalId);
                intervalActive = false;
                if (pendingTasks.length === 0) resolve();
                console.log(`Stopped monitoring ${config.pair} after ${config.stopAfter} ms`);
                resolve();
            }, config.stopAfter);
        }
    });
  });

  // Wait for all intervals to finish
  await Promise.all(intervalPromises);
  console.log("All monitoring intervals completed.");
  process.exit(0);
}
