import { db } from "../../config/db.config";

export interface AlertFilter {
  startTime?: string;
  endTime?: string;
  pair?: string;
  minRate?: number;
  maxRate?: number;
  botId?: number;
  configId?: number;
  limit?: number;
  offset?: number;
}

export class AlertDAO {
  async getAlerts(filters: AlertFilter) {
    let query = db("alerts")
        .select("alerts.*", "bot_configs.pair", "bot_configs.bot_id")
        .join("bot_configs", "alerts.bot_config_id", "bot_configs.id");

    if (filters.startTime) query = query.where("alerts.created_at", ">=", filters.startTime);
    if (filters.endTime) query = query.where("alerts.created_at", "<=", filters.endTime);
    if (filters.pair) query = query.where("bot_configs.pair", filters.pair);
    if (filters.minRate) query = query.where("alerts.rate", ">=", filters.minRate);
    if (filters.maxRate) query = query.where("alerts.rate", "<=", filters.maxRate);
    if (filters.botId) query = query.where("bot_configs.bot_id", filters.botId);
    if (filters.configId) query = query.where("alerts.bot_config_id", filters.configId);

    if (filters.limit) query = query.limit(filters.limit);
    if (filters.offset) query = query.offset(filters.offset);

    const limit = Math.min(filters.limit ?? 10, 100);
    const offset = filters.offset ?? 0; 
    query = query.limit(limit).offset(offset);

    return query;
  }
}
