import Decimal from "decimal.js";

export class ThresholdPriceChecker{
    // using an inmemory cache to record the last triggered price for notification
    // in larger prodcution envs, a redis cache could be appropriate
    private lastTriggeredPrice: Map<string, Decimal> = new Map();


    check(pair: string, price: Decimal, threshold: number){
        const lastPrice: Decimal | null = this.lastTriggeredPrice.get(pair) ?? null;
        if (lastPrice === null) {
            this.lastTriggeredPrice.set(pair, price);
            return false;
        }

        const priceDifference: Decimal = price.minus(lastPrice).abs();
        const changePerc: Decimal = priceDifference.div(lastPrice);

        if(changePerc.greaterThanOrEqualTo(threshold / 100)){
            this.lastTriggeredPrice.set(pair, price);
            return true;
        }
        return false;
    }
}