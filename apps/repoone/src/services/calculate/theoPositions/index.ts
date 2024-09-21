// @ts-nocheck

import { uniq, isNil, pipe } from "ramda";
import moment from "moment-timezone";

import { type PositionEstimate } from "opc-types/lib/PositionEstimate";
import { type StrategyComplete } from "opc-types/lib/Strategy";
import { FMT_YYYY_MM_DD, FMT_YYYY_MM_DD_HHMM } from "../../../consts/DATE_TIME";

import newYorkTime from "../../../utils/Time/newYorkTime";
import CentsMath from "../../../utils/CentsMath/CentsMath";
import calcBestStockPrice from "../../../utils/Finance/getBestStockPrice";
import round from "../../../utils/Data/round/round";
import timeTilExpiry from "../../../utils/Time/timeTilExpiry";
import getNearestExpiry from "../../../utils/Finance/getNearestExpiry";

import position from "../position";
import getTheoTimes from "./helpers/getTheoTimes";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type StratLegStockComplete } from "opc-types/lib/StratLegStock";
import objectFromEntries from "../../../utils/Data/objectFromEntries/objectFromEntries";
import { type Nullable } from "opc-types/lib/util/Nullable";
import filterOptionLegs from "../../../pwa/store/selectors/currentCalculation/filterOptionLegs";
import legsWithIds from "../../../pwa/store/selectors/currentCalculation/legsWithIds";
import { isNull } from "errable";
import {
  type EstimateConfig,
  MATRIX_TIME_GRANULARITY,
} from "../strategyEstimates";
import getPriceRange from "../helpers/getPriceRangeOfStrategy";

// todo: can this be pieced together from EstimateConfig & Strategy?
type CfgOpt = {
  priceMin: number;
  priceMax: number;
  dateMin: string;
  dateMax: string;
  dateTimeMin: string;
  maxTimePoints: number;
  maxPricePoints: number;
  pScale: number;
  stockChangeInValue: boolean;
  matrixTimeGranularity: MATRIX_TIME_GRANULARITY;
};
type CfgReq = {};
export type Cfg = CfgReq & CfgOpt;

export enum OUTER_OPTS {
  MIN = "MIN",
  MAX = "MAX",
}

type PartialEstCfg = Pick<
  EstimateConfig,
  | "stockChangeInValue"
  | "timeDecayBasis"
  | "closePriceMethod"
  | "pinRiskWarningPerc"
  | "matrixTimeGranularity"
>;

export const getOuterStrike = (strat: StrategyComplete, minMax: OUTER_OPTS) => {
  return legsWithIds(filterOptionLegs(strat)).reduce((bestMinMax, leg) => {
    return !leg.strike
      ? bestMinMax
      : isNull(bestMinMax) && leg.strike
      ? leg.strike
      : !isNull(bestMinMax) &&
        ((minMax === OUTER_OPTS.MIN && leg.strike < bestMinMax) ||
          (minMax === OUTER_OPTS.MAX && leg.strike > bestMinMax))
      ? leg.strike
      : bestMinMax;
  }, null as Nullable<number>);
};

const fillCfgDefaults = (
  cfg: Partial<CfgOpt> & CfgReq,
  estCfg: PartialEstCfg,
  strat: StrategyComplete
): Nullable<Cfg> => {
  const nearestExpiry = getNearestExpiry(strat) as string;
  const bestStockPrice = calcBestStockPrice(
    strat.legsById[strat.underlyingElement] as StratLegStockComplete
  );
  if (!bestStockPrice) return null;

  const dateMin =
    cfg.dateMin ||
    moment
      .tz(strat.timeOfCalculation, "America/New_York")
      .format(FMT_YYYY_MM_DD);
  const dateTimeMin = moment
    .tz(strat.timeOfCalculation, "America/New_York")
    .format(FMT_YYYY_MM_DD_HHMM);

  const timeTilExpiryVal = timeTilExpiry(
    nearestExpiry,
    estCfg.timeDecayBasis,
    cfg.dateMin !== undefined ? newYorkTime(dateMin) : strat.timeOfCalculation
  );

  const [dfltPriceMin, dfltPriceMax] = getPriceRange(
    strat,
    timeTilExpiryVal,
    nearestExpiry
  );

  const priceMin = !isNil(cfg.priceMin) ? cfg.priceMin : dfltPriceMin;
  const priceMax = !isNil(cfg.priceMax) ? cfg.priceMax : dfltPriceMax;

  if (isNil(priceMin) || isNull(priceMax)) return null;

  const maxPricePoints = cfg.maxPricePoints || 28;
  const pScale =
    cfg.pScale || calcPriceScale({ priceMax, priceMin, maxPricePoints });

  const atmNearestToPScale = CentsMath.mult(
    Math.round(bestStockPrice / pScale),
    pScale
  );
  const priceMinRoundToScale = Math.max(
    0,
    CentsMath.sub(
      atmNearestToPScale,
      CentsMath.mult(
        Math.ceil(CentsMath.sub(bestStockPrice, priceMin) / pScale),
        pScale
      )
    )
  );
  const priceMaxRoundToScale = CentsMath.add(
    atmNearestToPScale,
    CentsMath.mult(
      Math.ceil(CentsMath.sub(priceMax, bestStockPrice) / pScale),
      pScale
    )
  );

  return {
    ...cfg,
    maxTimePoints: 30,
    maxPricePoints,
    pScale,
    priceMin: priceMinRoundToScale,
    priceMax: priceMaxRoundToScale,
    dateTimeMin,
    dateMin: dateMin,
    dateMax: cfg.dateMax !== undefined ? cfg.dateMax : nearestExpiry,
    stockChangeInValue: cfg.stockChangeInValue || false,
    matrixTimeGranularity:
      cfg.matrixTimeGranularity || MATRIX_TIME_GRANULARITY.BEST_FIT,
  };
};

const calcPriceScale = pipe(
  (cfg: Pick<Cfg, "priceMax" | "priceMin" | "maxPricePoints">) =>
    (cfg.priceMax - cfg.priceMin) / cfg.maxPricePoints,
  (idealPrice): number => {
    if (idealPrice < 0.0375) return 0.025;
    else if (idealPrice < 0.075) return 0.05;
    else if (idealPrice < 0.125) return 0.1;
    else if (idealPrice < 0.175) return 0.15;
    else if (idealPrice < 0.225) return 0.2;
    else if (idealPrice < 0.3) return 0.25;
    else if (idealPrice < 0.41667) return 1 / 3;
    else if (idealPrice < 0.625) return 0.5;
    else if (idealPrice < 0.875) return 0.75;
    else if (idealPrice < 1.25) return 1;
    else if (idealPrice < 1.75) return 1.5;
    else if (idealPrice < 2.25) return 2;
    else if (idealPrice < 2.75) return 2.5;
    else return round(idealPrice);
  }
);

const theoPositions = (
  strat: StrategyComplete,
  estCfg: PartialEstCfg,
  partialCfg: Partial<CfgOpt> & CfgReq
) => {
  const cfg = fillCfgDefaults(partialCfg, estCfg, strat);
  if (!cfg) return null;

  const tTimes = getTheoTimes(cfg);
  const tDates = tTimes.map(
    (tTime) =>
      moment.tz(tTime, "America/New_York").format(`${FMT_YYYY_MM_DD}_HHmm`)
    // format(tTime, FMT_YYYY_MM_DD, { timeZone: 'America/New_York' }),
  );
  const timesTilExp = tTimes.map((tTime) =>
    legsWithIds(filterOptionLegs(strat)).reduce((acc, leg) => {
      if (!leg.disabled) {
        acc[leg.legId] = timeTilExpiry(
          leg?.expiry,
          estCfg.timeDecayBasis,
          tTime
        );
      }
      return acc;
    }, {} as ObjRecord<number>)
  );

  const positions = {} as Record<number, Record<string, PositionEstimate>>;
  for (
    let p = cfg.priceMin;
    p <= cfg.priceMax;
    p = CentsMath.add(p, cfg.pScale)
  ) {
    positions[round(p, 2)] = objectFromEntries(
      tTimes.map((tTime, i) => [
        tDates[i],
        position(
          {
            time: tTime,
            legTimesTilExpiry: timesTilExp[i],
            price: round(p, 2),
            ivShift: strat.ivShift,
          },
          estCfg,
          strat
        ),
      ])
    );
  }
  const allLegStrikes = uniq(
    legsWithIds(filterOptionLegs(strat)).map((opLeg) => opLeg.strike)
  );
  allLegStrikes.forEach((strike) => {
    const rStk = round(strike, 2);
    if (rStk <= cfg.priceMax && rStk > cfg.priceMin && !positions[rStk]) {
      positions[rStk] = objectFromEntries(
        tTimes.map((tTime, i) => [
          tDates[i],
          position(
            {
              time: tTime,
              legTimesTilExpiry: timesTilExp[i],
              price: rStk,
              ivShift: strat.ivShift,
            },
            estCfg,
            strat
          ),
        ])
      );
    }
  });

  return positions;
};

export default theoPositions;
