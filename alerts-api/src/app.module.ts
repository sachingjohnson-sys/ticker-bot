import { Module } from "@nestjs/common";
import { AlertsModule } from "./module/alerts.module.js";

@Module({
  imports: [AlertsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
