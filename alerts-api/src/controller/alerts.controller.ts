import { Controller, Post, Body } from "@nestjs/common";
import { AlertsService } from "../service/alerts.service.js";
import { GetAlertsDto } from "../dto/get-alerts.dto.js";

@Controller("alerts")
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Post("filter")
  async getAlerts(@Body() filters: GetAlertsDto) {
    return this.alertsService.getFilteredAlerts(filters);
  }
}