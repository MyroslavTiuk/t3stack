import { type Strategy } from "opc-types/lib/Strategy";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";

import legsWithIds from "../../../pwa/store/selectors/currentCalculation/legsWithIds";
import filterOptionLegs from "../../../pwa/store/selectors/currentCalculation/filterOptionLegs";
import { isVerticalSpreadLegs } from "./isVerticalSpread";

export const isDebitSpreadLegs = (
  legs: (StratLegOpt & { legId: string })[]
) => {
  if (!isVerticalSpreadLegs(legs)) return false;
  const soldLeg = legs.filter((leg) => leg.act === "sell")[0];
  const boughtLeg = legs.filter((leg) => leg.act === "buy")[0];
  if (
    (boughtLeg.opType === "call" &&
      (soldLeg.strike || 0) > (boughtLeg.strike || 0)) ||
    (boughtLeg.opType === "put" &&
      (soldLeg.strike || 0) < (boughtLeg.strike || 0))
  ) {
    return true;
  }
  return false;
};

export default function isDebitSpread(strat: Strategy) {
  return isDebitSpreadLegs(legsWithIds(filterOptionLegs(strat)));
}
