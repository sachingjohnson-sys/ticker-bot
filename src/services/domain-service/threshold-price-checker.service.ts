export class ThresholdPriceChecker{
    // using an inmemory cache to record the last triggered price for notification
    // in larger prodcution envs, a redis cache could be appropriate
    private lastTriggeredPrice: Map<string, number> = new Map();


    check(pair: string, price: number, threshold: number){
        let lastPrice: number | null = this.lastTriggeredPrice.get(pair) ?? null;
        if (lastPrice === null) { // first record of price will never be alerted but will be used as the starting benchmark
            this.lastTriggeredPrice.set(pair, price);
            lastPrice = price;
        }

        const priceDifference: number = Math.abs(lastPrice - price);
        const changePerc: number = (priceDifference / lastPrice) * 100;

        if(changePerc >= threshold){
            this.lastTriggeredPrice.set(pair, price);
            return { triggered: true, changePerc };
        }
        return { triggered: false, changePerc };
    }
}