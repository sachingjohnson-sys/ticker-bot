import type { ILogger } from "./ILogger.js";

type Subscriber = (message: string) => void;
export class ObservableLogger implements ILogger {
    private subscribers: Subscriber[] = [];

    public subscribe(subscriber : Subscriber){
        this.subscribers.push(subscriber);
    }

    public unsubscribe(subscriber : Subscriber){
        this.subscribers = this.subscribers.filter(s => s !== subscriber);
    }

    log(message: string): void {
        for (const sub of this.subscribers) {
            sub(message);
        }
    }   
}