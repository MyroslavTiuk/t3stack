import { StockData } from './StockData';
import { OptionsChain } from './OptionsChain';
import { PRICE_RESULT } from './api/responses/util/PRICE_RESULT';

export type PriceDataSuccess = {
  result: PRICE_RESULT.SUCCESS;
  time: number;
  retrievedTime?: number;
  stock: StockData;
  options: OptionsChain;
};
export type PriceData =
  | {
      result:
        | PRICE_RESULT.SYMBOL_NOT_FOUND
        | PRICE_RESULT.UNEXPECTED_FORMAT
        | PRICE_RESULT.OPTIONS_NOT_FOUND;
      time: number; // timestamp
      retrievedTime?: number;
      stock: null;
      options: null;
    }
  | PriceDataSuccess;
