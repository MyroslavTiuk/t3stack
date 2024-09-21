import { type OptionChain, type StockDataType } from "@utils/tdApiTypes";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

const tdAmeritradeUrl = "https://api.tdameritrade.com/v1/marketdata";
const api_key = process.env.TD_AMERITRADE_API_KEY;

export const tdApiRouter = router({
  options: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .query(async ({ input }) => {
      const { symbol } = input;
      const options = await getOptionsFromTdAmeritrade(symbol);
      return options;
    }),
  stock: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .query(async ({ input }) => {
      const { symbol } = input;
      const stock = await getStockFromTdAmeritrade(symbol);
      return stock;
    }),
});

async function getOptionsFromTdAmeritrade(symbol: string) {
  const url = `${tdAmeritradeUrl}/chains?symbol=${symbol}&apikey=${api_key}`;
  const response = await fetch(url);
  const data: OptionChain = await response.json();
  return data;
}

async function getStockFromTdAmeritrade(symbol: string) {
  const url = `${tdAmeritradeUrl}/${symbol}/quotes?apikey=${api_key}`;
  const response = await fetch(url);
  const data = await response.json();
  const stockData: StockDataType = data[symbol];
  return stockData;
}
