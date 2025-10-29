import { ThresholdPriceChecker } from "../../src/services/domain-service/threshold-price-checker.service.js";

describe("ThresholdPriceChecker", () => {
  let checker: ThresholdPriceChecker;

  beforeEach(() => {
    checker = new ThresholdPriceChecker();
  });

  test("should trigger alert only after threshold exceeded", () => {
    const pair = "BTC-USD"; 

    const firstResult = checker.check(pair, 100, 1); // first incoming price is not expected to create an alert
    expect(firstResult.triggered).toBe(false);
    expect(firstResult.changePerc).toBe(0);

    const secondResult = checker.check(pair, 102, 1); // 2% change
    expect(secondResult.triggered).toBe(true);
    expect(secondResult.changePerc).toBeCloseTo(2);
  });

  test("should not trigger alert when threshold not exceeded", () => {
    const pair = "BTC-USD";

    checker.check(pair, 100, 5);
    const result = checker.check(pair, 102, 5); 

    expect(result.triggered).toBe(false);
  });
});
