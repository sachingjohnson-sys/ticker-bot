export interface Alert {
  id?: number;
  ticker_id: number;
  bot_config_id: number;
  rate: number;
  created_at: Date;
}