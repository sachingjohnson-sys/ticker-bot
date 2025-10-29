import axios from "axios";
import { API_BASE_URL } from "../../config/appConfig.js";
import { TickerDAO } from "../../infrastructure/dao/TickerDAO.js";

export interface TickerAPIReponse {
  bid: number;
  ask: number;
  currency: string;
}

export class TickerService {

  constructor(private tickerDAO: TickerDAO) {}



  async saveTicker(
    pair: string,
    bid: number,
    ask: number,
    currency: string,
    bot_config_id: number
  ): Promise<number> {
    const tickerId = await this.tickerDAO.create({
      pair,
      bid,
      ask,
      currency,
      bot_config_id,
    });

    return tickerId;
  }


  async fetchTickers(pair: string): Promise<TickerAPIReponse | null> {
    const url = `${API_BASE_URL}/${pair}`;
    //console.log("SamplesURL: " + url);
    try {
      const response = await axios.get<TickerAPIReponse[]>(url);
      //console.log("Full API response:", JSON.stringify(response.data, null, 2));
      //console.log("Samples: " + response.status);
      // Uphold returns an array of ticker objects
      let ticker: TickerAPIReponse | null = null;
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
