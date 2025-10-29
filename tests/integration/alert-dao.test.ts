import { db } from "../../src/config/db.config.js";
import { AlertDAO } from "../../src/infrastructure/dao/alert.dao.js";
import { BotConfigDAO } from "../../src/infrastructure/dao/botConfig.dao.js";
import { TickerDAO } from "../../src/infrastructure/dao/ticker.dao.js";
import type { Alert } from "../../src/model/alert.model.js";

describe("AlertDAO", () => {
  const alertDAO = new AlertDAO();
  const botConfigDAO = new BotConfigDAO();
  const tickerDAO = new TickerDAO();


  beforeEach(async () => {
    // clean up table before each test run
    await db("bot_configs").del();
  });

  afterAll(async () => {
    await db.destroy(); // clean up DB connection
  });

  test("can insert and fetch an alert", async () => {


    const botConfigId = await botConfigDAO.create({
      bot_id: 1,
      pair: "BTC-USD",
      interval: 60,
      threshold: 2.5,
    });

    const tickerId = await tickerDAO.create({
      pair: "BTC-USD",
      bid: 100,
      ask: 101,
      currency: "USD",
      bot_config_id: botConfigId,
    });

    const alertId = await alertDAO.create({
      ticker_id: tickerId, 
      bot_config_id: botConfigId,
      rate: 0.05,
      created_at: new Date(),
    });

    expect(alertId).toBeDefined();

    const rows = await alertDAO.getAll();
    const insertedAlert : Alert | undefined = rows.find(r => r.id === alertId);

    expect(insertedAlert).toBeDefined();
    expect(insertedAlert!.ticker_id).toBe(tickerId);
    expect(insertedAlert!.bot_config_id).toBe(botConfigId);
    expect(Number(insertedAlert!.rate)).toBeCloseTo(0.05);
  });
});
