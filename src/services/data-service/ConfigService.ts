import type { BotConfigDAO } from "../../infrastructure/dao/BotConfigDAO.js";

export class ConfigService {
  constructor(private botConfigDao: BotConfigDAO) {}

  async saveConfig(botId: number, pair: string, interval: number, threshold: number): Promise<number> { 
    const configId = await this.botConfigDao.create({
      botId: botId,
      pair: pair,
      interval: interval,
      threshold: threshold,
    });
    return configId;
  }
}
