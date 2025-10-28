
import BOT_CONFIG_JSON from "../config/botConfig.json";

export interface CurrencyConfig {
  pair: string;
  interval: number;     
  threshold: number;    
}

export const BOT_CONFIG: CurrencyConfig[] = BOT_CONFIG_JSON as CurrencyConfig[];
export const API_BASE_URL = "https://api.uphold.com/v0/ticker";