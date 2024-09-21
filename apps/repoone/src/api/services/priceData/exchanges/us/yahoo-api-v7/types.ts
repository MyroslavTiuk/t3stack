export type YahooOption = {
  contractSymbol: string;
  strike: number;
  currency: string;
  lastPrice: number;
  change: number;
  percentChange: number;
  volume: number;
  openInterest: number;
  bid: number;
  ask: number;
  contractSize: string;
  expiration: number;
  lastTradeDate: number;
  impliedVolatility: number;
  inTheMoney: boolean;
};
export type YahooDataResult = {
  expirationDates: number[];
  strikes: number[];
  quote: {
    bid: number;
    ask: number;
    postMarketPrice: number;
    regularMarketPrice: number;
  };
  options: {
    expirationDate: number;
    calls: YahooOption[];
    puts: YahooOption[];
  }[];
};
export type YahooDataOutlineSuccess = {
  optionChain: {
    result: [YahooDataResult];
    error: null;
  };
};
