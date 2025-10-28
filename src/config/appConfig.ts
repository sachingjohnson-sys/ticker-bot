import fs from "fs/promises";
import path from "path";

const jsonPath = path.resolve("./src/config/botConfig.json");
const BOT_CONFIG_JSON = JSON.parse(await fs.readFile(jsonPath, "utf-8"));

export interface CurrencyConfig {
  pair: string;
  interval: number;     
  threshold: number;    
}

export const BOT_CONFIG: CurrencyConfig[] = BOT_CONFIG_JSON as CurrencyConfig[];
export const API_BASE_URL = "https://api.uphold.com/v0/ticker";