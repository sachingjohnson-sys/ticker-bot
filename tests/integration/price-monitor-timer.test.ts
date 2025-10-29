import { jest } from "@jest/globals";

import { TickerService, type TickerAPIReponse } from "../../src/services/data-service/ticker.service.js";
import { AlertService } from "../../src/services/data-service/alert.service.js";
import { ThresholdPriceChecker } from "../../src/services/domain-service/threshold-price-checker.service.js";

// --- Mock factory for service methods ---
export const createServiceMocks = () => {
  const fetchTickersMock = jest.fn(async (pair: string): Promise<TickerAPIReponse | null> => {
    return { bid: 100, ask: 101, currency: "USD" };
  });

  const checkMock = jest.fn((pair: string, price: number, threshold: number) => ({
    triggered: true,
    changePerc: 1,
  }));

  const saveAlertMock = jest.fn(async (tickerId: number, botConfigId: number, rate: number, createdAt: Date) => {});

  return { fetchTickersMock, checkMock, saveAlertMock };
};

import { monitorBots } from "../../src/bots/PriceMonitorBot.js";

// --- Use fake timers to control setInterval / setTimeout ---
jest.useFakeTimers();

// --- Mock the config ---
jest.mock("../../src/config/app.config.js", () => ({
  BOT_CONFIG: [
    { botId: 1, pair: "BTC-USD", interval: 1000, threshold: 0.5, stopAfter: 2000 },
  ],
}));


/*

This needs to be worked on jest mocks seem to missing the call needed for assertion.

*/


describe.skip("PriceMonitorBot interval test", () => {
  let fetchTickersMock: jest.MockedFunction<(pair: string) => Promise<TickerAPIReponse | null>>;
  let checkMock: jest.MockedFunction<(pair: string, price: number, threshold: number) => { triggered: boolean; changePerc: number }>;
  let saveAlertMock: jest.MockedFunction<(tickerId: number, botConfigId: number, rate: number, createdAt: Date) => Promise<void>>;

  beforeEach(() => {
    ({ fetchTickersMock, checkMock, saveAlertMock } = createServiceMocks());

    // Inject mocks into service prototypes
    TickerService.prototype.fetchTickers = fetchTickersMock;
    ThresholdPriceChecker.prototype.check = checkMock;
    AlertService.prototype.saveAlert = saveAlertMock;
  });

  test("Runs interval cycles and triggers alerts correctly", async () => {
    const monitorPromise = monitorBots();

    // Advance timers for first interval
    jest.advanceTimersByTime(1000);

    // Flush async tasks in interval callback
    await jest.runOnlyPendingTimersAsync();

    expect(fetchTickersMock).toHaveBeenCalledWith("BTC-USD");
    expect(checkMock).toHaveBeenCalledWith("BTC-USD", 100, 0.5);
    expect(saveAlertMock).toHaveBeenCalled();

    // Advance timers to stopAfter to complete interval
    jest.advanceTimersByTime(2000);
    await jest.runOnlyPendingTimersAsync();

    await monitorPromise;
  });
});
