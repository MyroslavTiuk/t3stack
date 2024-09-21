import { MARKETS, MARKET_MAP } from "../../../consts";

export const DEFAULT_EXCHANGE: string = MARKETS.US;

/**
 * Standardise input so everybody looking for the same symbol ends up in the same
 * format
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const normaliseSymbol: Function = (fullSymbol: string): string =>
  fullSymbol.toLowerCase().trim();

/**
 * Extract the exchange portion of the fullSymbol entered
 * U.S. options return as MARKETS_US
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const getExchange: Function = (fullSymbol: string): string => {
  const normalisedSymbol: string = normaliseSymbol(fullSymbol);
  const isTo =
    normalisedSymbol.length > 3 &&
    normalisedSymbol.substr(normalisedSymbol.length - 3) === ".to";

  if (isTo) return MARKET_MAP.to;
  return DEFAULT_EXCHANGE;
};

/**
 * Extract the stock symbol portion of the full symbol
 */
export const getStockSymbol: Function = (fullSymbol: string): string => {
  const normalisedSymbol: string = normaliseSymbol(fullSymbol);
  const exch = getExchange(normalisedSymbol);
  if (exch === DEFAULT_EXCHANGE) {
    return normalisedSymbol;
  }
  const lastDot = normalisedSymbol.lastIndexOf(".");
  if (lastDot === -1) return normalisedSymbol;
  return normalisedSymbol.substr(0, lastDot);
};
