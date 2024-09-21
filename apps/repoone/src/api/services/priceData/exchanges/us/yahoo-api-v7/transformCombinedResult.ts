import moment from "moment-timezone";

import { type PriceData } from "opc-types/lib/PriceData";
import { type Outcome } from "opc-types/lib/Outcome";
import { type StockData } from "opc-types/lib/StockData";
import {
  type OptionsChain,
  type OptionsChain_options,
} from "opc-types/lib/OptionsChain";

import { PRICE_RESULT } from "../../../../../../types/enums/PRICE_RESULT";
import { errorFactory } from "../../../../../infrastructure/errorHanding";

import { type YahooDataResult, type YahooOption } from "./types";

const transformStock = (yahooCombinedData: YahooDataResult): StockData => {
  return {
    last:
      yahooCombinedData.quote.postMarketPrice ||
      yahooCombinedData.quote.regularMarketPrice,
    bid: yahooCombinedData.quote.bid,
    ask: yahooCombinedData.quote.ask,
    ivHist: null,
  };
};

const parseOptionsChainSide = (
  options: YahooOption[]
): OptionsChain_options => {
  return options.reduce((acc, option) => {
    acc[option.strike] = {
      a: option.ask,
      b: option.bid,
      i: option.openInterest,
      iv: Math.round(option.impliedVolatility * 100 * 100) / 100,
      l: option.lastPrice,
      v: option.volume,
      c: Math.round(option.change * 1000) / 1000,
    };
    return acc;
  }, {} as OptionsChain_options) /* .sort() */;
};

const transformOptions = (yahooCombinedData: YahooDataResult): OptionsChain => {
  return yahooCombinedData.options.reduce((acc: OptionsChain, optionMonth) => {
    const exp = moment
      .tz(optionMonth.expirationDate * 1000, "GMT")
      .format("Y-MM-DD");
    return {
      ...acc,
      [exp]: {
        c: parseOptionsChainSide(optionMonth.calls),
        p: parseOptionsChainSide(optionMonth.puts),
      },
    };
  }, {} as OptionsChain);
};

export const transformCombinedResult = (
  yahooCombinedData: YahooDataResult
): Outcome<PriceData> => {
  try {
    const stock = transformStock(yahooCombinedData);
    const options = transformOptions(yahooCombinedData);
    const now = Date.now();
    return {
      retrievedTime: now,
      time: now,
      options,
      stock,
      result: PRICE_RESULT.SUCCESS,
    };
  } catch (e) {
    return errorFactory("Error transforming pricing data");
  }
};
