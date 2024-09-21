import { lensPath, map, pipe, reduce, set } from "ramda";
import { ifNotNull, isNull } from "errable";

import position from "../position";

import { type PositionEstimateInitial } from "opc-types/lib/PositionEstimate";
import { type StrategyEstimateSummary } from "opc-types/lib/StrategyEstimateSummary";
import { type StrategyComplete } from "opc-types/lib/Strategy";
import { type StratLegOptComplete } from "opc-types/lib/StratLegOpt";
import { type StratLegStockComplete } from "opc-types/lib/StratLegStock";
import { type Optional } from "opc-types/lib/util/Optional";

import { add } from "../../../utils/CentsMath/CentsMath";
import timeTilExpiry from "../../../utils/Time/timeTilExpiry";
import newYorkTime from "../../../utils/Time/newYorkTime";
import getBestStockPrice from "../../../utils/Finance/getBestStockPrice";
import timeBasedStdDev from "../../../utils/Finance/timeBasedStdDev";
import { isStratLegOpt } from "../../../utils/Finance/Strategy";
import getCollateral from "../../../utils/Finance/getCollateral";

import bruteForceSummary from "./bruteForceSummary";
import findBreakEvensFlat from "./findBreakEvensFlat";
import { type EstimateConfig } from "../strategyEstimates";
import { findInflections } from "./findInflections";
import { isNullOrUndefined } from "util";
import { getPoP } from "./getPoP";

type SumCfgKeys =
  | "maxDate"
  | "stockChangeInValue"
  | "timeDecayBasis"
  | "closePriceMethod"
  | "pinRiskWarningPerc"
  | "ivHist";
type SumCfg = Pick<EstimateConfig, SumCfgKeys>;

interface GetPricesAtSpotParams {
  checkPrices: number[];
  infChk: boolean;
  maxCalcEndOfDate: string;
  posFn: typeof position;
}

const getPricesAtSpot = (
  strat: StrategyComplete,
  cfg: SumCfg,
  { checkPrices, infChk, maxCalcEndOfDate, posFn }: GetPricesAtSpotParams
) => {
  const chkPrcSorted = checkPrices.sort((a, b) => a - b);
  const quotes = chkPrcSorted.reduce(
    (pricesAcc, p) => ({
      ...pricesAcc,
      [p]: posFn(
        {
          time: newYorkTime(maxCalcEndOfDate),
          price: p,
          ivShift: strat.ivShift,
        },
        cfg,
        strat
      ).gross,
    }),
    {} as Record<number, number>
  );
  return infChk &&
    quotes[chkPrcSorted[chkPrcSorted.length - 1]] > 0 &&
    quotes[chkPrcSorted[chkPrcSorted.length - 1]] >
      quotes[chkPrcSorted[chkPrcSorted.length - 2]]
    ? set(lensPath([chkPrcSorted[chkPrcSorted.length - 1]]), Infinity, quotes)
    : infChk &&
      quotes[chkPrcSorted[chkPrcSorted.length - 1]] <= 0 &&
      quotes[chkPrcSorted[chkPrcSorted.length - 1]] <
        quotes[chkPrcSorted[chkPrcSorted.length - 2]]
    ? set(lensPath([chkPrcSorted[chkPrcSorted.length - 1]]), -Infinity, quotes)
    : quotes;
};

const getPriceKeyForMin = (
  priceProfits: Record<number, number>,
  curUndPrice: Optional<number>,
  infKey?: number,
  doMaxInstead = false
) => {
  const pricePoints = map(parseFloat, Object.keys(priceProfits)).sort(
    (a, b) => a - b
  );
  return pipe(
    reduce((maxPrice, pricePoint: number) => {
      // const price = pricePoints[pricePoint];
      if (maxPrice === false) return [pricePoint];
      if (priceProfits[pricePoint] === priceProfits[maxPrice[0]]) {
        return maxPrice.concat([pricePoint]);
      }
      if (
        (doMaxInstead &&
          priceProfits[pricePoint] > priceProfits[maxPrice[0]]) ||
        (!doMaxInstead && priceProfits[pricePoint] < priceProfits[maxPrice[0]])
      )
        return [pricePoint];
      return maxPrice;
    }, false as number[] | false) as (keys: number[]) => number[],
    (minPrices) => {
      return findInflections(minPrices, pricePoints, infKey);
    }
  )(pricePoints);
};

const hasHorizontalExpiries = pipe(
  (strat: StrategyComplete) =>
    reduce(
      (acc, legId) => {
        const leg = strat.legsById[legId];
        return !isStratLegOpt(leg)
          ? acc
          : {
              ...acc,
              [leg.expiry]: 1,
            };
      },
      {},
      strat.legs
    ),
  (allExpiries) => Object.keys(allExpiries).length > 1
);

/**
 * This calculates the maximums at expiry only
 */
const summaryPure = (
  posFn: typeof position,
  strat: StrategyComplete,
  init: PositionEstimateInitial,
  theoPoints: {}, // todo type
  // note cfg.maxCalcDate is used for calculating the Standard Deviation prices, from timeNow, as well as
  //   the date to use to calculate position.
  //   It will default to be the close of the day
  cfg: SumCfg
): StrategyEstimateSummary => {
  const horizExp = hasHorizontalExpiries(strat);
  const usedHistIv = strat.histIV || cfg.ivHist || undefined;

  const maxCalcEndOfDate =
    (cfg.maxDate || "").replace(/-/g, "").length === 8
      ? `${cfg.maxDate} 16:00:00`
      : cfg.maxDate;
  const strikes = strat.legs.reduce(
    (strikes, legId) =>
      strikes.concat(
        strat.legsById[legId].type === "option"
          ? [(strat.legsById[legId] as StratLegOptComplete).strike]
          : []
      ),
    [] as number[]
  );
  const maxX = Math.max(...strikes);
  const infStk = maxX + 10000;
  const checkPrices = [0, ...strikes, infStk];

  const gpasParams = {
    maxCalcEndOfDate,
    posFn,
  };
  const prices = horizExp
    ? null
    : getPricesAtSpot(strat, cfg, { checkPrices, infChk: true, ...gpasParams });
  // todo: some duplication here, only really need to recalculate the infStk
  const pricesNoInf = horizExp
    ? null
    : getPricesAtSpot(strat, cfg, {
        checkPrices,
        infChk: false,
        ...gpasParams,
      });

  // todo: assuming underlying element of the leg
  const curUndPrice = getBestStockPrice(
    strat.legsById[strat.underlyingElement] as StratLegStockComplete
  );

  const timeNowTilExp = timeTilExpiry(
    newYorkTime(maxCalcEndOfDate),
    cfg.timeDecayBasis,
    strat.timeOfCalculation
  );
  const ivCurTilExpDec = timeBasedStdDev(timeNowTilExp, strat.atmIV);
  const ivHistTilExpDec = !usedHistIv
    ? null
    : timeBasedStdDev(timeNowTilExp, usedHistIv);
  const ivTilExpDec = ivHistTilExpDec || ivCurTilExpDec;

  const prices1SD = !curUndPrice
    ? null
    : (getPricesAtSpot(strat, cfg, {
        checkPrices: [
          curUndPrice * (1 - ivTilExpDec),
          curUndPrice * (1 + ivTilExpDec),
        ],
        infChk: false,
        ...gpasParams,
      }) as Record<number, number>);
  const prices2SD = !curUndPrice
    ? null
    : (getPricesAtSpot(strat, cfg, {
        checkPrices: [
          curUndPrice * (1 - ivTilExpDec * 2),
          curUndPrice * (1 + ivTilExpDec * 2),
        ],
        infChk: false,
        ...gpasParams,
      }) as Record<number, number>);

  const maxRisk1SDprice = isNull(prices1SD)
    ? null
    : getPriceKeyForMin(prices1SD, curUndPrice);
  const maxRisk1SD =
    isNull(prices1SD) || isNullOrUndefined(maxRisk1SDprice?.[0]?.[0])
      ? null
      : add(prices1SD[maxRisk1SDprice?.[0]?.[0] || 0], init.gross);
  // const maxRisk1SDpriceRel =
  //   isNull(maxRisk1SDprice) || !curUndPrice
  //     ? null
  //     : maxRisk1SDprice < curUndPrice
  //     ? -1
  //     : 1;

  const maxRisk2SDprice = isNull(prices2SD)
    ? null
    : getPriceKeyForMin(prices2SD, curUndPrice);
  const maxRisk2SD =
    isNull(prices2SD) || isNullOrUndefined(maxRisk2SDprice?.[0]?.[0])
      ? null
      : add(prices2SD[maxRisk2SDprice?.[0]?.[0] || 0], init.gross);
  // const maxRisk2SDpriceRel =
  //   isNull(maxRisk2SDprice) || !curUndPrice
  //     ? null
  //     : maxRisk2SDprice < curUndPrice
  //     ? -1
  //     : 1;

  function interpolatedSummary(
    prices: Record<number, number>,
    pricesNoInf: Record<number, number>
  ) {
    const maxReturn = add(Math.max(...Object.values(prices)), init.gross);
    return {
      maxReturnPrice: getPriceKeyForMin(prices, curUndPrice, infStk, true),
      maxRiskPrice: getPriceKeyForMin(prices, curUndPrice, infStk),
      maxReturn,
      maxRisk: add(Math.min(...Object.values(prices)), init.gross),
      breakevens: findBreakEvensFlat(init, pricesNoInf),
      break75:
        maxReturn === Infinity
          ? []
          : findBreakEvensFlat(init, pricesNoInf, maxReturn * 0.75),
      break50:
        maxReturn === Infinity
          ? []
          : findBreakEvensFlat(init, pricesNoInf, maxReturn * 0.5),
      break100:
        maxReturn === Infinity
          ? []
          : findBreakEvensFlat(init, pricesNoInf, maxReturn),
    };
  }

  const {
    maxReturnPrice,
    maxRiskPrice,
    maxReturn,
    maxRisk,
    breakevens,
    break50,
    break75,
    break100,
  } =
    horizExp || !prices || !pricesNoInf
      ? bruteForceSummary(posFn, strat, init, theoPoints, cfg)
      : interpolatedSummary(prices, pricesNoInf);

  const collateral = getCollateral(strat);
  const roiCollateral = ifNotNull(
    (marginNum) => maxReturn / -marginNum,
    collateral
  );
  const ivHist = usedHistIv || strat.atmIV;
  const { pop, pop50, pop75, pop100 } =
    !ivHist || !curUndPrice
      ? { pop: null, pop50: null, pop75: null, pop100: null }
      : {
          pop: getPoP(curUndPrice, timeNowTilExp, breakevens, ivHist),
          pop50: getPoP(curUndPrice, timeNowTilExp, break50, ivHist),
          pop75: getPoP(curUndPrice, timeNowTilExp, break75, ivHist),
          pop100: getPoP(curUndPrice, timeNowTilExp, break100, ivHist),
        };

  return {
    maxReturn,
    maxReturnPrice,
    maxRisk,
    maxRiskPrice,
    maxRisk1SD,
    maxRisk2SD,
    maxRisk1SDprice,
    prices1SD,
    // maxRisk1SDpriceRel,
    maxRisk2SDprice,
    prices2SD,
    // maxRisk2SDpriceRel,
    breakevens,
    collateral,
    roiCollateral,
    pop,
    pop50,
    pop75,
    pop100,
  };
};

const summary = (
  strat: StrategyComplete,
  init: PositionEstimateInitial,
  theoPoints: {}, // todo type
  meta: SumCfg
): StrategyEstimateSummary => {
  return summaryPure(position, strat, init, theoPoints, meta);
};

export default summary;
