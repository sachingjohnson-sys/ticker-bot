import axios from "axios";
import { API_BASE_URL } from "../../config/appConfig";

export interface Ticker {
  ask: string;
  bid: string;
  currency: string;
  pair: string;
}

export class TickerService {

  async fetchTickers(pair: string): Promise<Ticker | null> {
    const url = `${API_BASE_URL}/${pair}`;
    try {
      const response = await axios.get<Ticker[]>(url);
      // Uphold returns an array of ticker objects
      return response.data[0] ?? null;
    } catch (error) {
        console.error(`Incorrect pair provided in config: `, error);
        return null;
    }

  }
}
