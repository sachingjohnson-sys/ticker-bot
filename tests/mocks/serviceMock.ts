import type { TickerAPIReponse } from "../../src/services/data-service/ticker.service.js";

export const createServiceMocks = () => {
  const fetchTickersMock = jest.fn<Promise<TickerAPIReponse | null>, [string]>()
    .mockResolvedValue({ bid: 100, ask: 101, currency: "USD" });

  const checkMock = jest.fn<{ triggered: boolean; changePerc: number }, [string, number, number]>()
    .mockReturnValue({ triggered: true, changePerc: 1 });

  const saveAlertMock = jest.fn<Promise<void>, [number, number, number, Date]>()
    .mockResolvedValue();

  return { fetchTickersMock, checkMock, saveAlertMock };
};