import { Injectable } from "@nestjs/common";
import { AlertDAO } from "../infrastructure/dao/alert.dao.js";
import { GetAlertsDto } from "../dto/get-alerts.dto.js";

@Injectable()
export class AlertsService {
  constructor(private alertDao: AlertDAO) {}

  async getFilteredAlerts(dto: GetAlertsDto) {
    const filters = {
      startTime: dto.startTime,
      endTime: dto.endTime,
      pair: dto.pair,
      minRate: dto.minRate,
      maxRate: dto.maxRate,
      botId: dto.botId,
      configId: dto.configId,
      limit: dto.limit,
      offset: dto.offset,
    };
    return this.alertDao.getAlerts(filters);
  }
}