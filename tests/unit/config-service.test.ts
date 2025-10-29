import { jest } from '@jest/globals';
import { ConfigService } from "../../src/services/data-service/config.service.js";
import type { BotConfigDAO } from "../../src/infrastructure/dao/botConfig.dao.js";

describe("ConfigService", () => {
  let botConfigDaoMock: jest.Mocked<BotConfigDAO>;
  let service: ConfigService;

  beforeEach(() => {
    botConfigDaoMock = {
      create: jest.fn()
    } as unknown as jest.Mocked<BotConfigDAO>;

    service = new ConfigService(botConfigDaoMock);
  });

  it("should call botConfigDao.create with correct parameters and return ID", async () => {
    const botId = 1;
    const pair = "BTC-USD";
    const interval = 5000;
    const threshold = 0.01;
    const expectedId = 42;

    botConfigDaoMock.create.mockResolvedValue(expectedId);

    const configId = await service.saveConfig(botId, pair, interval, threshold);

    expect(botConfigDaoMock.create).toHaveBeenCalledTimes(1);
    expect(botConfigDaoMock.create).toHaveBeenCalledWith({
      bot_id: botId,
      pair,
      interval,
      threshold,
    });
    expect(configId).toBe(expectedId);
  });
});
