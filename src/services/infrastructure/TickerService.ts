import axios from "axios";
import { API_BASE_URL } from "../../config/appConfig.js";

export interface Ticker {
  ask: string;
  bid: string;
  currency: string
}

export class TickerService {

  async fetchTickers(pair: string): Promise<Ticker | null> {
    const url = `${API_BASE_URL}/${pair}`;
    //console.log("SamplesURL: " + url);
    try {
      const response = await axios.get<Ticker[]>(url);
      //console.log("Full API response:", JSON.stringify(response.data, null, 2));
      //console.log("Samples: " + response.status);
      // Uphold returns an array of ticker objects
      let ticker: Ticker | null = null;
      if(response.status == 404){
        throw new Error(`Incorrect pair provided in config:`);
      }
      if (Array.isArray(response.data)) {
        ticker = response.data[0] ?? null;
      } else {
        ticker = response.data ?? null;
      }
      //console.log("Half API response:", JSON.stringify(ticker));
      return ticker;
    } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status ?? "N/A";
          let message: string;
          if (typeof error.response?.data === "object") {
            message = JSON.stringify(error.response.data);
          } else {
            message = error.response?.data ?? error.message;
          }
          console.error(
            `Error fetching ticker for ${pair} (status ${status}): ${message}`
          );
        } else {
          console.error(`Unexpected error fetching ticker for ${pair}:`, error);
        }
        return null;
    }

  }
}
