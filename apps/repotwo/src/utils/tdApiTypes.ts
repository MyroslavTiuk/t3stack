export type StockDataType = {
  "52WkHigh": number;
  "52WkLow": number;
  askId: string;
  askPrice: number;
  askSize: number;
  assetMainType: string;
  assetSubType: string;
  assetType: string;
  bidId: string;
  bidPrice: number;
  bidSize: number;
  bidTick: string;
  closePrice: number;
  cusip: string;
  delayed: boolean;
  description: string;
  digits: number;
  divAmount: number;
  divDate: string;
  divYield: number;
  exchange: string;
  exchangeName: string;
  highPrice: number;
  lastId: string;
  lastPrice: number;
  lastSize: number;
  lowPrice: number;
  marginable: boolean;
  mark: number;
  markChangeInDouble: number;
  markPercentChangeInDouble: number;
  nAV: number;
  netChange: number;
  netPercentChangeInDouble: number;
  openPrice: number;
  peRatio: number;
  quoteTimeInLong: number;
  realtimeEntitled: boolean;
  regularMarketLastPrice: number;
  regularMarketLastSize: number;
  regularMarketNetChange: number;
  regularMarketPercentChangeInDouble: number;
  regularMarketTradeTimeInLong: number;
  securityStatus: string;
  shortable: boolean;
  symbol: string;
  totalVolume: number;
  tradeTimeInLong: number;
  volatility: number;
};

export type OptionChain = {
  callExpDateMap: ExpDateMap;
  putExpDateMap: ExpDateMap;
};

export interface ExpDateMap {
  [expiryDate: string]: OptionsByStrike;
}

export interface OptionsByStrike {
  [strikePrice: string]: OptionsContract[];
}

export type OptionsContract = {
  ask: number;
  askSize: number;
  bid: number;
  bidAskSize: string;
  bidSize: number;
  closePrice: number;
  daysToExpiration: number;
  deliverableNote: string;
  delta: number;
  description: string;
  exchangeName: string;
  expirationDate: number;
  expirationType: string;
  gamma: number;
  highPrice: number;
  inTheMoney: boolean;
  intrinsicValue: number;
  isIndexOption: null;
  last: number;
  lastSize: number;
  lastTradingDay: number;
  lowPrice: number;
  mark: number;
  markChange: number;
  markPercentChange: number;
  mini: boolean;
  multiplier: number;
  netChange: number;
  nonStandard: boolean;
  openInterest: number;
  openPrice: number;
  optionDeliverablesList: any;
  pennyPilot: boolean;
  percentChange: number;
  putCall: "PUT" | "CALL";
  quoteTimeInLong: number;
  rho: number;
  settlementType: string;
  strikePrice: number;
  symbol: string;
  theoreticalOptionValue: number;
  theoreticalVolatility: number;
  theta: number;
  timeValue: number;
  totalVolume: number;
  tradeDate: any;
  tradeTimeInLong: number;
  vega: number;
  volatility: number;
};
