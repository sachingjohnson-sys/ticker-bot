import "./bots/PriceMonitorBot.js";
import { runBot } from "./bots/PriceMonitorBot.js";
const timestamp = new Date().toISOString();
console.log(`${timestamp} - Ticker bot started...`);
runBot();