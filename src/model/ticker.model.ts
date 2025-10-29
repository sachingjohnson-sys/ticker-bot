export interface Ticker {
  id?: number;
  pair: string;
  bid: number;
  ask: number;
  currency: string;
  bot_config_id: number;
  created_at?: Date;
}