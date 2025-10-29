export interface BotConfig {
  id?: number;
  botId: number;
  pair: string;
  interval: number;
  threshold: number;
  created_at?: Date;
}