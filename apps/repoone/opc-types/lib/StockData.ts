import { Nullable } from './util/Nullable';

export type StockData = {
  last: Nullable<number>;
  bid: Nullable<number>;
  ask: Nullable<number>;
  ivHist: Nullable<number>;
  // dividend: number,
  // earnings: number, // timestamp
};
