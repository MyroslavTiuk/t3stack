import { type Strategy } from "opc-types/lib/Strategy";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";

import legsWithIds from "../../../pwa/store/selectors/currentCalculation/legsWithIds";
import filterOptionLegs from "../../../pwa/store/selectors/currentCalculation/filterOptionLegs";

export const isVerticalSpreadLegs = (
  legs: (StratLegOpt & { legId: string })[]
) => {
  if (legs.length !== 2) return false;
  const soldLegs = legs.filter((leg) => leg.act === "sell");
  const boughtLegs = legs.filter((leg) => leg.act === "buy");
  if (soldLegs.length !== 1 || boughtLegs.length !== 1) {
    return false;
  }
  const soldLeg = soldLegs[0];
  const boughtLeg = boughtLegs[0];
  if (soldLeg.opType !== boughtLeg.opType) return false;

  return true;
};

export default function isVerticalSpread(strat: Strategy) {
  return isVerticalSpreadLegs(legsWithIds(filterOptionLegs(strat)));
}
