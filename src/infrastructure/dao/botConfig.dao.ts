import { db } from "../../config/db.config.js";
import type { BotConfig } from "../../model/botConfig.model.js";

export class BotConfigDAO {
  async create(botConfig: BotConfig): Promise<number> {
    const [row] = await db("bot_configs").insert(botConfig).returning("id");
    return row.id;
  }

  async getAll(): Promise<BotConfig[]> {
    return db("bot_configs").select("*");
  }
}
