export interface BotConfig {
  id?: number;
  bot_id: number;
  pair: string;
  interval: number;
  threshold: number;
  created_at?: Date;
}