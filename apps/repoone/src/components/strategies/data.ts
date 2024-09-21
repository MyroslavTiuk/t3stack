import { TradingStrategy } from "opcalc-database";

export const tradingStrategyFriendlyNames = {
  [TradingStrategy.BuyAndHold]: "Buy and Hold",
  [TradingStrategy.BuyAndSell]: "Buy and Sell",
  [TradingStrategy.ShortAndHold]: "Short and Hold",
  [TradingStrategy.ShortAndBuy]: "Short and Buy",
  [TradingStrategy.Custom]: "Custom",
  [TradingStrategy.CoveredCall]: "Covered Call",
  [TradingStrategy.LongCallSpread]: "Long Call Spread",
  [TradingStrategy.LongPutSpread]: "Long Put Spread",
  [TradingStrategy.ShortCallSpread]: "Short Call Spread",
  [TradingStrategy.ShortPutSpread]: "Short Put Spread",
};
