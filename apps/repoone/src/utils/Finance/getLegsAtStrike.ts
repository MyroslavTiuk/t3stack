import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { isStratLegOpt } from "./Strategy";
import { type LegIndTuple } from "../../pwa/components/modules/StrategyCalculator/OptionLeg/types/StrikeChoice";
import { type Strategy } from "opc-types/lib/Strategy";

const getLegsAtStrike = (legs: Strategy["legsById"]) => {
  return Object.values(legs).reduce((acc, leg) => {
    if (isStratLegOpt(leg) && leg.strike) {
      const stk = leg.strike.toString();
      acc[stk] = (acc[stk] || ([] as LegIndTuple[])).concat([
        [leg.act, leg.opType],
      ]);
    }
    return acc;
  }, {} as ObjRecord<LegIndTuple[]>);
};

export default getLegsAtStrike;
