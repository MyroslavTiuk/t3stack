import { TradingStrategy } from "trackgreeks-database";

export const tradingStrategyFriendlyNames = {
  // @ts-ignore
  [TradingStrategy.custom]: "Custom",
  // @ts-ignore
  [TradingStrategy.coveredCall]: "Covered Call",
  // @ts-ignore
  [TradingStrategy.longCallSpread]: "Long Call Spread",
  // @ts-ignore
  [TradingStrategy.longPutSpread]: "Long Put Spread",
  // @ts-ignore
  [TradingStrategy.shortCallSpread]: "Short Call Spread",
  // @ts-ignore
  [TradingStrategy.shortPutSpread]: "Short Put Spread",
};
