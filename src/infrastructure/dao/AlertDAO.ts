import { db } from "../../config/dbConfig.js";
import type { Alert } from "../../model/Alert.js";

export class AlertDAO
 {
  async create(alert: Alert): Promise<number> {
    const [row] = await db("alerts").insert(alert).returning("id");
    return row.id;
  }

  async getAll(): Promise<Alert[]> {
    return db("alerts").select("*");
  }
}

