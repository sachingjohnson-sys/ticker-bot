import { Module } from "@nestjs/common";
import { AlertsService } from "../service/alerts.service.js";
import { AlertsController } from "../controller/alerts.controller.js";
import { AlertDAO } from "../infrastructure/dao/alert.dao.js";

@Module({
  controllers: [AlertsController],
  providers: [AlertsService, AlertDAO],
})
export class AlertsModule {}
