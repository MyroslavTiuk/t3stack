import { type PositionEstimateInitial } from "opc-types/lib/PositionEstimate";
import { type StrategyComplete } from "opc-types/lib/Strategy";

import CentsMath from "../../../utils/CentsMath/CentsMath";
import round from "../../../utils/Data/round/round";
import getBestStockPrice from "../../../utils/Finance/getBestStockPrice";
import { type StratLegStockComplete } from "opc-types/lib/StratLegStock";

import position from "../position";
import { isStratLegOpt } from "../../../utils/Finance/Strategy";
import newYorkTime from "../../../utils/Time/newYorkTime";
import findBreakEvensFlat from "./findBreakEvensFlat";
import timeTilExpiry from "../../../utils/Time/timeTilExpiry";
import { type StratLegOptComplete } from "opc-types/lib/StratLegOpt";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type EstimateConfig } from "../strategyEstimates";

function incPrice(p: number, refPrice: number) {
  const priceDelta = Math.abs(p - refPrice) / refPrice;
  const inc =
    priceDelta < 0.25
      ? Math.min(0.01, Math.max(0.5, refPrice / 1000))
      : priceDelta < 0.5
      ? Math.min(0.1, Math.max(1, refPrice / 500))
      : priceDelta < 2
      ? Math.min(0.1, Math.max(10, refPrice / 500))
      : // : priceDelta < 5 ? Math.min(1, Math.max(5, refPrice / 500))
        refPrice / 10;
  return round(p + inc, 2);
}

type SumCfgKeys =
  | "maxDate"
  | "stockChangeInValue"
  | "timeDecayBasis"
  | "closePriceMethod"
  | "pinRiskWarningPerc";
type SumCfg = Pick<EstimateConfig, SumCfgKeys>;

const bruteForceSummary = (
  posFn: typeof position,
  strat: StrategyComplete,
  init: PositionEstimateInitial,
  theoPoints: {}, // todo type
  // note cfg.maxCalcDate is used for calculating the Standard Deviation prices, from timeNow, as well as
  //   the date to use to calculate position.
  //   It will default to be the close of the day
  cfg: SumCfg
) => {
  const maxCalcEndOfDate =
    cfg.maxDate.replace(/-/g, "").length === 8
      ? `${cfg.maxDate} 16:00:00`
      : cfg.maxDate;

  const curUndPrice = getBestStockPrice(
    strat.legsById[strat.underlyingElement] as StratLegStockComplete
  );
  const refPrice = Math.max(
    curUndPrice || 0,
    ...strat.legs.map((legId) => {
      const leg = strat.legsById[legId];
      return isStratLegOpt(leg) ? leg.strike : 0;
    })
  );

  const runningMaxs = {
    maxReturn: -Infinity,
    maxReturnPrice: -Infinity,
    maxRisk: Infinity,
    maxRiskPrice: -Infinity,
  };

  const time = newYorkTime(maxCalcEndOfDate);
  const timesTilExp = strat.legs.reduce(
    (acc, legId) => ({
      ...acc,
      ...(isStratLegOpt(strat.legsById[legId])
        ? {
            [legId]: timeTilExpiry(
              (strat.legsById[legId] as StratLegOptComplete)?.expiry,
              cfg.timeDecayBasis,
              time
            ),
          }
        : {}),
    }),
    {} as ObjRecord<number>
  );

  const pricesGross: Record<number, number> = {};
  for (
    let p = 0;
    p <= refPrice * 100;
    p = incPrice(p, curUndPrice || refPrice)
  ) {
    const pos = position(
      {
        time,
        legTimesTilExpiry: timesTilExp,
        price: round(p, 2),
      },
      cfg,
      strat
    );
    pricesGross[p] = pos.gross;

    if (pos.gross > runningMaxs.maxReturn) {
      runningMaxs.maxReturn = pos.gross;
      runningMaxs.maxReturnPrice = p;
    }
    if (
      pos.gross < runningMaxs.maxRisk ||
      (pos.gross === runningMaxs.maxRisk &&
        Math.abs(p - refPrice) < Math.abs(runningMaxs.maxRiskPrice - refPrice))
    ) {
      runningMaxs.maxRisk = pos.gross;
      runningMaxs.maxRiskPrice = p;
    }
  }
  const maxReturn = CentsMath.add(runningMaxs.maxReturn, init.gross);
  return {
    ...runningMaxs,
    maxRiskPrice: [
      [runningMaxs.maxRiskPrice, runningMaxs.maxRiskPrice] as [number, number],
    ],
    maxReturnPrice: [
      [runningMaxs.maxReturnPrice, runningMaxs.maxReturnPrice] as [
        number,
        number
      ],
    ],
    maxReturn,
    maxRisk: CentsMath.add(runningMaxs.maxRisk, init.gross),
    breakevens: findBreakEvensFlat(init, pricesGross),
    break50:
      maxReturn === Infinity
        ? []
        : findBreakEvensFlat(init, pricesGross, maxReturn * 0.5),
    break75:
      maxReturn === Infinity
        ? []
        : findBreakEvensFlat(init, pricesGross, maxReturn * 0.75),
    break100:
      maxReturn === Infinity
        ? []
        : findBreakEvensFlat(init, pricesGross, maxReturn),
  };
};

export default bruteForceSummary;
