import { AlertDAO } from "../../infrastructure/dao/AlertDAO.js";

export class AlertService {
  constructor(private alertDao: AlertDAO) {}

  async saveAlert(tickerId: number, botConfigId: number, rate: number, created_at: Date) {
    await this.alertDao.create({
      ticker_id: tickerId,
      bot_config_id: botConfigId,
      rate: rate,
      created_at: created_at
    });
  }
  
}
