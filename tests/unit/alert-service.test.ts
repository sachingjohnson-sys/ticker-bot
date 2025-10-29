import { jest } from '@jest/globals';
import { AlertService } from "../../src/services/data-service/alert.service.js";
import { AlertDAO } from "../../src/infrastructure/dao/alert.dao.js";

describe("AlertService", () => {
  let alertDaoMock: jest.Mocked<AlertDAO>;
  let service: AlertService;

  beforeEach(() => {
    alertDaoMock = {
      create: jest.fn()
    } as unknown as jest.Mocked<AlertDAO>;

    service = new AlertService(alertDaoMock);
  });

  it("should call alertDao.create with correct parameters", async () => {
    const tickerId = 1;
    const botConfigId = 42;
    const rate = 0.01;
    const timestamp = new Date();

    await service.saveAlert(tickerId, botConfigId, rate, timestamp);

    expect(alertDaoMock.create).toHaveBeenCalledTimes(1);
    expect(alertDaoMock.create).toHaveBeenCalledWith({
      ticker_id: tickerId,
      bot_config_id: botConfigId,
      rate: rate,
      created_at: timestamp,
    });
  });
});
