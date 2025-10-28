import { ThresholdPriceChecker } from "../services/business/ThresholdPriceChecker";
import { TickerService } from "../services/infrastructure/TickerService";
import { Decimal } from "decimal.js";
import { ConsoleLoggerSubscriber } from "../services/infrastructure/logger/subscribers/ConsoleLogger";
import { ObservableLogger } from "../services/infrastructure/logger/ObservableLogger";

import { BOT_CONFIG } from "../config/appConfig";

const tickerService = new TickerService();
const thresholdPriceChecker = new ThresholdPriceChecker();

const observableLogger = new ObservableLogger();
observableLogger.subscribe(ConsoleLoggerSubscriber);

export function startMonitoring() {
    BOT_CONFIG.forEach(config  =>
        setInterval(async () => {
            const ticker = await tickerService.fetchTickers(config.pair);
            if(!ticker){
                console.error(`Ticker not found for ${config.pair} ${config.interval} ${config.threshold}`);
                return;
            }

            const price = new Decimal(ticker.bid);
            const isAlert = thresholdPriceChecker.check(config.pair, price, config.threshold);
            if(isAlert){
                observableLogger.log(`Alert for ${config.pair}, ${price}, ${config.threshold}`);
            }

        }, config.interval)
    );
}