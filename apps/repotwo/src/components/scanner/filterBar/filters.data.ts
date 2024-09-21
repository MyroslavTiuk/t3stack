import {
  type StockFilters,
  type TradeFilters,
} from "src/server/router/scanner";

export enum FilterType {
  Numeric = "Numeric",
  Boolean = "Boolean",
  Range = "Range",
  Multiplier = "Multiplier",
  Date = "Date",
}

export const stockFilterData: StockFilterData = {
  marketCap: {
    filterType: FilterType.Multiplier,
    name: "Market Capitalization",
    apiParameter: "marketCap",
    format: (price: number) => "$" + price,
    formatParameter: (price: number) => price / 1000000,
  },
  peRatio: {
    filterType: FilterType.Numeric,
    name: "P/E Ratio",
    apiParameter: "peRatio",
  },
  stockPrice: {
    filterType: FilterType.Numeric,
    name: "Stock Price",
    apiParameter: "price",
    format: (price: number) => "$" + price,
  },
  dividendYield: {
    filterType: FilterType.Numeric,
    name: "Dividend Yield",
    apiParameter: "dividendYield",
    format: (price: number) => price + "%",
    formatParameter: (price: number) => price / 100,
  },
  dividendAmount: {
    filterType: FilterType.Numeric,
    name: "Dividend Amount",
    apiParameter: "dividendAmount",
    format: (price: number) => "$" + price,
  },
  beta: {
    filterType: FilterType.Numeric,
    name: "Beta",
    apiParameter: "beta",
  },
};

export const tradeFilterData: TradeFilterData = {
  iv: {
    filterType: FilterType.Numeric,
    name: "Implied Volatility",
    apiParameter: "iv",
    format: (price: number) => price + "%",
    formatParameter: (price: number) => price / 100,
  },
  otm: {
    filterType: FilterType.Numeric,
    name: "Out of the Money",
    apiParameter: "otmPercent",
    format: (price: number) => price + "%",
    formatParameter: (price: number) => price / 100,
  },
  probabilityOfProfit: {
    filterType: FilterType.Range,
    name: "Probability of Profit",
    apiParameter: "pop",
    format: (price: number) => price + "%",
    formatParameter: (price: number) => price / 100,
  },
  spread: {
    filterType: FilterType.Numeric,
    name: "Bid Ask Spread",
    apiParameter: "bidAskSpread",
    format: (price: number) => "$" + price,
  },
  expirationDate: {
    filterType: FilterType.Date,
    name: "Expiration",
    apiParameter: "daysToExpiration",
  },
  volume: {
    filterType: FilterType.Numeric,
    name: "Volume",
    apiParameter: "volume",
  },
};

type Filter<Type, PossibleParameters> = {
  filterType: Type;
  name: string;
  apiParameter: PossibleParameters;
  format?: (param: number) => string;
  formatParameter?: (param: number) => number;
};

type NumericFilter<PossibleParameters> = Filter<
  FilterType.Numeric,
  PossibleParameters
>;
type BooleanFilter<PossibleParameters> = Filter<
  FilterType.Boolean,
  PossibleParameters
>;
type RangeFilterType<PossibleParameters> = Filter<
  FilterType.Range,
  PossibleParameters
>;
type MultiplierFilterType<PossibleParameters> = Filter<
  FilterType.Multiplier,
  PossibleParameters
>;
type DateFilterType<PossibleParameters> = Filter<
  FilterType.Date,
  PossibleParameters
>;

type FilterEntry<PossibleParameters> =
  | NumericFilter<PossibleParameters>
  | BooleanFilter<PossibleParameters>
  | RangeFilterType<PossibleParameters>
  | MultiplierFilterType<PossibleParameters>
  | DateFilterType<PossibleParameters>;

type FilterData<PossibleParameters> = {
  [filterId: string]: FilterEntry<PossibleParameters>;
};

export type StockFilterData = FilterData<keyof StockFilters>;
export type StockFilterEntry = FilterEntry<keyof StockFilters>;

export type TradeFilterData = FilterData<keyof TradeFilters>;
export type TradeFilterEntry = FilterEntry<keyof TradeFilters>;
