import { pipe, uniq, mean } from "ramda";
import { ifNotUndefined } from "errable";

import { type PriceDataSuccess } from "opc-types/lib/PriceData";
import { getBestStockPriceFromStockData } from "./getBestStockPrice";
import { find_iv } from "../../services/calculate/blackScholes";
import { FINANCE } from "../../config/Finance";
import timeTilExpiry from "../Time/timeTilExpiry";
import getBestOptionPrice from "./getBestOptionPrice";
import orUndef from "../Data/orUndef/orUndef";
import opTypeKey from "../String/opTypeKey/opTypeKey";
import round from "../Data/round/round";
import { type EstimateConfig } from "../../services/calculate/strategyEstimates";

type Cfg = Pick<EstimateConfig, "timeDecayBasis">;

const getBestCurVol = (
  prices: PriceDataSuccess,
  cfg: Cfg,
  passedExp?: string,
  passedTimeNow?: number
) => {
  const timeNow = passedTimeNow || prices.retrievedTime;
  const exp =
    passedExp ||
    // todo: find expiry closest to 30 days away, if passedExp is empty
    pipe(
      () => Object.keys(prices.options),
      (exps) =>
        exps.find((exp) => timeTilExpiry(exp, cfg.timeDecayBasis, timeNow) > 0)
    )();
  if (!exp) return 0;
  const tte = timeTilExpiry(exp, cfg.timeDecayBasis, timeNow);
  // todo: use interest rate in cfg.
  const rC = FINANCE.INTEREST_RATE;

  return pipe(
    function getStockPrice() {
      return getBestStockPriceFromStockData(prices.stock);
    },
    ifNotUndefined(function findATMstrikes(bestCurPrice) {
      const allStrikes = uniq(
        Object.keys(prices.options[exp]?.[opTypeKey.CALL] || {}).concat(
          Object.keys(prices.options[exp]?.[opTypeKey.PUT] || {})
        )
      );
      const closest4Strikes = Object.entries(allStrikes)
        .map(
          ([i, stk]) =>
            [i, stk, Math.abs(parseFloat(stk) - bestCurPrice)] as [
              string,
              string,
              number
            ]
        )
        .sort((a, b) => -(b[2] - a[2]))
        .slice(0, 4)
        .map(([_, stk]) => stk);

      const allIVs: number[] = closest4Strikes
        .reduce((acc, stk) => {
          const nStk = parseFloat(stk);
          const callPriceSet = prices.options[exp]?.[opTypeKey.CALL]?.[nStk];
          const callPrice = callPriceSet && getBestOptionPrice(callPriceSet);
          const putPriceSet = prices.options[exp]?.[opTypeKey.PUT]?.[nStk];
          const putPrice = putPriceSet && getBestOptionPrice(putPriceSet);
          return [
            ...acc,
            orUndef(
              callPrice && find_iv(true, bestCurPrice, nStk, rC, tte, callPrice)
            ),
            orUndef(
              putPrice && find_iv(false, bestCurPrice, nStk, rC, tte, putPrice)
            ),
          ];
        }, [] as (undefined | number)[])
        .filter((x) => x !== undefined) as number[];
      return mean(allIVs);
    }),
    ifNotUndefined((x) => round(x, 3))
  )();
};

export default getBestCurVol;
