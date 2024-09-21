import { type t } from "opc-types/lib";
import { type PriceData } from "opc-types/lib/PriceData";
import { MARKETS, MESSAGES } from "../../../consts";
import { errorFactory } from "../../infrastructure/errorHanding";
import {
  getStockSymbol,
  getExchange,
} from "../../../utils/Finance/market/market";
import { getPriceData as getPriceData_us } from "./exchanges/us";
import getPriceData_ca from "./exchanges/ca";

const marketDataSources: {
  [key: string]: (
    symbol: string,
    month: t.Optional<string>
  ) => Promise<t.Outcome<PriceData>>;
} = {
  [MARKETS.US]: getPriceData_us,
  [MARKETS.MX]: getPriceData_ca,
};

const getPriceFromMarket = (
  exchange: string
): ((
  symbol: string,
  month: t.Optional<string>
) => Promise<t.Outcome<PriceData>>) =>
  marketDataSources[exchange] ||
  function exchangeNotFound(): Promise<t.Outcome<PriceData>> {
    return Promise.resolve(errorFactory(MESSAGES.EXCHANGE_NOT_FOUND));
  };

/**
 * Task runner for getting prices
 */
export async function getPriceData(
  fullSymbol: string,
  month: t.Optional<string>,
  cacheTime: number
): Promise<{ expiry: number; result: t.Outcome<PriceData> }> {
  const stock: string = getStockSymbol(fullSymbol);
  const exchange: string = getExchange(fullSymbol);

  return {
    expiry: Date.now() / 1000 + 60 * cacheTime,
    result: await getPriceFromMarket(exchange)(stock, month),
  };
}
