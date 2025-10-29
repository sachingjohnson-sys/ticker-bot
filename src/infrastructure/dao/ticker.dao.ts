import { db } from "../../config/db.config.js";
import type { Ticker } from "../../model/ticker.model.js";

export class TickerDAO {
  async create(ticker: Ticker): Promise<number> {
    const [row] = await db("tickers").insert(ticker).returning("id");
    return row.id;
  }

  async getAll(): Promise<Ticker[]> {
    return db("ticker").select("*");
  }
}
