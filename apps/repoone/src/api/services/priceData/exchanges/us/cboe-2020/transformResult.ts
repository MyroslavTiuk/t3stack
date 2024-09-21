import { isErr } from "errable";

import { type Outcome } from "opc-types/lib/Outcome";
import { type PriceData } from "opc-types/lib/PriceData";
import {
  type OptionsChain,
  type OptionsChain_options,
  type OptionsChain_types,
} from "opc-types/lib/OptionsChain";

import { errorFactory } from "../../../../../infrastructure/errorHanding";
import MESSAGES from "../../../../../../consts/MESSAGES";
import parseInt10 from "../../../../../../utils/Maths/parseInt10";
import { PRICE_RESULT } from "../../../../../../types/enums/PRICE_RESULT";

import {
  checkOption,
  checkOptionsArray,
  checkResponse,
  checkStockData,
} from "./typechecks";

const unexpectedFormatError = errorFactory(MESSAGES.UNEXPECTED_FORMAT);

const getStockData = (
  response: unknown
): Outcome<NonNullable<PriceData["stock"]>> => {
  if (!checkResponse(response) || !checkStockData(response.data)) {
    return unexpectedFormatError;
  }
  const { data } = response;

  return {
    last: data.current_price,
    ask: data.ask,
    bid: data.bid,
    ivHist: data.iv30 || null,
  };
};

const getOptionsData = (
  stock: string,
  response: unknown
): Outcome<NonNullable<PriceData["options"]>> => {
  if (!checkResponse(response) || !checkOptionsArray(response.data)) {
    return unexpectedFormatError;
  }
  const { data } = response;
  const strippedStock = stock.replace("_", "").trim().toLowerCase();

  return data.options.reduce((chain, option) => {
    if (isErr(chain) || !checkOption(option)) {
      return errorFactory(MESSAGES.UNEXPECTED_FORMAT, {
        data: { stage: "While checking option", option },
      });
    }
    const matches = option.option.match(/(.*?)(\d{6})([CP])(.*)$/);

    if (!matches || matches.length < 5) {
      return errorFactory(MESSAGES.UNEXPECTED_FORMAT, {
        data: { stage: "While checking option", option },
      });
    }
    const [RootSymbol, date, OpType, strikeMCents] = matches.slice(1);

    const rootSymbol = (RootSymbol || "").toLowerCase();

    if (
      rootSymbol === strippedStock ||
      rootSymbol === `${strippedStock}w` ||
      rootSymbol === `${strippedStock}p`
    ) {
      const expDate = `20${date}`; // `20${date.slice(0, 2)}-${date.slice(2, 4)}-${date.slice(4, 6)}`;
      const opType = OpType.toLowerCase();
      const strike = parseInt10(strikeMCents) / 1000;

      if (!chain[expDate]) chain[expDate] = {} as OptionsChain_types;
      if (!chain[expDate][opType])
        chain[expDate][opType] = {} as OptionsChain_options;

      chain[expDate][opType][strike] = {
        l: option.last_trade_price,
        b: option.bid,
        a: option.ask,
        v: option.volume,
        i: option.open_interest,
        iv: (option.iv ?? 0) * 100,
        t: option.theta ?? undefined,
        g: option.gamma ?? undefined,
        d: option.delta ?? undefined,
        c: option.change ?? undefined,
      };
    }
    return chain;
  }, {} as Outcome<OptionsChain>);
};

const transformResult = (stock: string, data: unknown): Outcome<PriceData> => {
  const stockData = getStockData(data);
  const options = getOptionsData(stock, data);

  if (isErr(stockData) || isErr(options)) {
    return {
      result: PRICE_RESULT.UNEXPECTED_FORMAT,
      time: -1,
      retrievedTime: Date.now(),
      stock: null,
      options: null,
    };
  }
  return {
    result: PRICE_RESULT.SUCCESS,
    time: -1,
    retrievedTime: Date.now(),
    stock: stockData,
    options,
  };
};

export default transformResult;
