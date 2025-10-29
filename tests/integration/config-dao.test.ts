import { db } from "../../src/config/db.config.js";
import { BotConfigDAO } from "../../src/infrastructure/dao/botConfig.dao.js";
import type { BotConfig } from "../../src/model/botConfig.model.js";

describe("BotConfigDAO", () => {
  const botConfigDAO = new BotConfigDAO();

  beforeEach(async () => {
    // clean up table before each test run
    await db("bot_configs").del();
  });

  afterAll(async () => {
    await db.destroy(); // close DB connection
  });

  test("can insert and fetch a bot config", async () => {

    const botConfigId = await botConfigDAO.create({
      bot_id: 1,
      pair: "BTC-USD",
      interval: 60,
      threshold: 2.5,
    });

    expect(botConfigId).toBeDefined();

    const rows = await botConfigDAO.getAll();

    const insertedConfig: BotConfig | undefined = rows.find(r => r.id === botConfigId);
    expect(insertedConfig).toBeDefined();
    expect(insertedConfig!.bot_id).toBe(1);
    expect(insertedConfig!.pair).toBe("BTC-USD");
    expect(insertedConfig!.interval).toBe(60);
    expect(Number(insertedConfig!.threshold)).toBeCloseTo(2.5);
  });
});
