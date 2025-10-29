import { db } from "../../config/dbConfig.js";
import type { BotConfig } from "../../model/BotConfig.js";

export class BotConfigDAO {
  async create(botConfig: BotConfig): Promise<number> {
    const [row] = await db("bot_configs").insert(botConfig).returning("id");
    return row.id;
  }

  async getAll(): Promise<BotConfig[]> {
    return db("bot_configs").select("*");
  }
}
