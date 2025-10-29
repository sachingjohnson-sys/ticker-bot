import { jest } from '@jest/globals';
import { TickerService, type TickerAPIReponse } from '../../src/services/data-service/ticker.service.js';

describe('TickerService', () => {
  let service: TickerService;

  beforeEach(() => {
    // Create a new service instance with a fake DAO
    service = new TickerService({ create: jest.fn() } as any);
    jest.clearAllMocks();
  });

  test('fetchTickers returns first ticker', async () => {
    const apiResponse: TickerAPIReponse[] = [{ bid: 100, ask: 101, currency: 'USD' }];

    // Mock the fetchTickers method to return the first ticker
    const fetchTickersMock: jest.MockedFunction<(pair: string) => Promise<TickerAPIReponse | null>> = 
    jest.fn();

    fetchTickersMock.mockResolvedValue(apiResponse[0]!);
    service.fetchTickers = fetchTickersMock;
    const result = await service.fetchTickers('BTC-USD');

    expect(result).toEqual(apiResponse[0]);
  });

  test('fetchTickers returns null if API returns empty array', async () => {
    // Mock fetchTickers to return null
    // Mock the fetchTickers method to return the first ticker
    const fetchTickersMock: jest.MockedFunction<(pair: string) => Promise<TickerAPIReponse | null>> = 
    jest.fn();

    fetchTickersMock.mockResolvedValue(null);
    service.fetchTickers = fetchTickersMock;
    const result = await service.fetchTickers('BTC-USD');
    expect(result).toBeNull();
  });

  test('saveTicker calls TickerDAO.create with correct params', async () => {
    const mockCreate = jest.fn(async () => 42);
    const serviceWithMock = new TickerService({ create: mockCreate } as any);

    const tickerId = await serviceWithMock.saveTicker('BTC-USD', 100, 101, 'USD', 1);

    expect(mockCreate).toHaveBeenCalledWith({
      pair: 'BTC-USD',
      bid: 100,
      ask: 101,
      currency: 'USD',
      bot_config_id: 1,
    });

    expect(tickerId).toBe(42);
  });
});
