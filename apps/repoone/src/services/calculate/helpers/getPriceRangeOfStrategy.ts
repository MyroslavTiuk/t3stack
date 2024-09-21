import { type StrategyComplete } from "opc-types/lib/Strategy";
import timeBasedStdDev from "../../../utils/Finance/timeBasedStdDev";
import { isNil } from "ramda";
import { getOuterStrike, OUTER_OPTS } from "../theoPositions";
import calcBestStockPrice from "../../../utils/Finance/getBestStockPrice";
import { type StratLegStockComplete } from "opc-types/lib/StratLegStock";
import { type Tuple } from "opc-types/lib/Tuple";
import { type Nullable } from "opc-types/lib/util/Nullable";
import round from "../../../utils/Data/round/round";

const MIN_CHANGE = 0.02;

export const getDefaultPriceRange = (
  strat: StrategyComplete,
  timeTilExp: number
): Tuple<Nullable<number>> => {
  const shift1SD = timeBasedStdDev(
    timeTilExp,
    Math.max(20, Math.min(100, strat.atmIV || 0))
  );

  const bestStockPrice = calcBestStockPrice(
    strat.legsById[strat.underlyingElement] as StratLegStockComplete
  );
  if (!bestStockPrice) return [null, null];

  const outerStrikeMin = getOuterStrike(strat, OUTER_OPTS.MIN) || Infinity;
  const outerStrikeMax = getOuterStrike(strat, OUTER_OPTS.MAX) || 0;
  const priceMin = Math.max(
    0,
    Math.min(
      bestStockPrice * (1 - MIN_CHANGE),
      bestStockPrice * (1 - shift1SD),
      outerStrikeMin
    )
  );
  const priceMax = Math.max(
    bestStockPrice * (1 + MIN_CHANGE),
    bestStockPrice * (1 + shift1SD),
    outerStrikeMax
  );
  const priceMinWBuffer =
    priceMin < outerStrikeMin * 0.97 ? priceMin : outerStrikeMin * 0.97;
  const priceMaxWBuffer =
    priceMax > outerStrikeMax * 1.03 ? priceMax : outerStrikeMax * 1.03;

  return [round(priceMinWBuffer, 2), round(priceMaxWBuffer, 2)];
};

const getPriceRange = (
  strat: StrategyComplete,
  timeTilExp: number
): Tuple<Nullable<number>> => {
  const dPR = getDefaultPriceRange(strat, timeTilExp);

  const priceMin = !isNil(strat.priceRange?.[0]) ? strat.priceRange[0] : dPR[0];

  const priceMax = !isNil(strat.priceRange?.[1]) ? strat.priceRange[1] : dPR[1];

  return [round(priceMin, 2), round(priceMax, 2)];
};

export default getPriceRange;
