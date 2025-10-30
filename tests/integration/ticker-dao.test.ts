import { db } from "../../src/config/db.config.js";
import { BotConfigDAO } from "../../src/infrastructure/dao/botConfig.dao.js";
import { TickerDAO } from "../../src/infrastructure/dao/ticker.dao.js";

describe("TickerDAO", () => {
  const tickerDAO = new TickerDAO();
  const botConfigDAO = new BotConfigDAO();

  beforeEach(async () => {
    // clean up table before each test run
    await db("bot_configs").del();
  });
  
  afterAll(async () => {
    await db.destroy();
  });

  test("can insert and fetch a ticker", async () => {

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

    const rows = await tickerDAO.getAll();
    expect(rows.find(r => r.id === tickerId)).toBeDefined();
  });
});