import { jest } from '@jest/globals'
import { ObservableLogger } from "../../src/infrastructure/logger/ObservableLogger.js";

describe("ObservableLogger", () => {

  test("should notify subscribers when log is called", () => {
    const logger = new ObservableLogger();

    const subscriber1 = jest.fn();
    const subscriber2 = jest.fn();

    logger.subscribe(subscriber1);
    logger.subscribe(subscriber2);

    const message = "Test alert";
    logger.log(message);

    expect(subscriber1).toHaveBeenCalledWith(message);
    expect(subscriber2).toHaveBeenCalledWith(message);
  });


  test("should notify only subscribers when log is called", () => {
    const logger = new ObservableLogger();

    const subscriber1 = jest.fn();
    const subscriber2 = jest.fn();

    logger.subscribe(subscriber1);
    logger.subscribe(subscriber2);

    logger.unsubscribe(subscriber1);
    const message = "Test alert";
    logger.log(message);

    expect(subscriber1).not.toHaveBeenCalled();
    expect(subscriber2).toHaveBeenCalledWith(message);
  });
});
