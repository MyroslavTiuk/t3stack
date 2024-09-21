import { isNull } from "errable";

import {
  type OptionsChain,
  type OptionsChainImm,
} from "opc-types/lib/OptionsChain";
import { type OptionData } from "opc-types/lib/OptionData";
import { TIME_DECAY_BASIS } from "../../../../../../types/enums/TIME_DECAY_BASIS";

import { FINANCE } from "../../../../../../config/Finance";
import {
  black_scholes,
  find_iv,
} from "../../../../../../services/calculate/blackScholes";
import getBestOptionPrice from "../../../../../../utils/Finance/getBestOptionPrice";
import timeTilExpiry from "../../../../../../utils/Time/timeTilExpiry";
import round from "../../../../../../utils/Data/round/round";
import mapObj from "../../../../../../utils/Data/mapObj/mapObj";

const calcOpDataGreeks = (
  curStockPrice: number,
  tte: number,
  opType: "c" | "p",
  stk: number,
  opData: OptionData
): OptionData => {
  const bestOptionPrice = getBestOptionPrice(opData);
  const iv = !bestOptionPrice
    ? null
    : find_iv(
        opType === "c",
        curStockPrice,
        stk,
        FINANCE.INTEREST_RATE,
        tte,
        bestOptionPrice
      );
  const greeks = isNull(iv)
    ? null
    : black_scholes(
        opType === "c",
        curStockPrice,
        stk,
        FINANCE.INTEREST_RATE,
        iv,
        tte,
        FINANCE.DFLT_DAYS_PER_YEAR,
        true
      );

  return {
    ...opData,
    iv: iv || 0,
    d: round(greeks?.delta || 0, 4),
    g: round(greeks?.gamma || 0, 4),
    t: round(greeks?.theta || 0, 4),
  };
};

export const calculateGreeksImm = (
  chain: OptionsChainImm,
  curStockPrice = 0
): OptionsChainImm => {
  const now = Date.now();
  return chain.map((expiryChain, exp) => {
    const tte = timeTilExpiry(
      exp,
      /* TODO */ TIME_DECAY_BASIS.CALENDAR_DAYS,
      now
    );
    return !expiryChain
      ? expiryChain
      : expiryChain.map((typeChain, opType) => {
          return !typeChain
            ? typeChain
            : typeChain.map((opData, stk) =>
                calcOpDataGreeks(curStockPrice, tte, opType, stk, opData)
              );
        });
  });
};

const calcGreeks = (chain: OptionsChain, curStockPrice = 0): OptionsChain => {
  const now = Date.now();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Record index assumes string
  return mapObj((expiryChain, exp) => {
    const tte = timeTilExpiry(
      exp,
      /* TODO */ TIME_DECAY_BASIS.CALENDAR_DAYS,
      now
    );
    return !expiryChain
      ? expiryChain
      : mapObj((typeChain, opType) => {
          return !typeChain
            ? typeChain
            : mapObj(
                (opData, stk) =>
                  calcOpDataGreeks(
                    curStockPrice,
                    tte,
                    opType as "c" | "p",
                    parseFloat(stk),
                    opData
                  ),
                typeChain
              );
        }, expiryChain);
  }, chain);
};

export default calcGreeks;
