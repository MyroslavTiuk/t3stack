import { type Optional } from "opc-types/lib/util/Optional";
import { type StrategyComplete } from "opc-types/lib/Strategy";

// Note: mutates param
export function scaleStratToBudget(
  budget: Optional<number>,
  maxRiskCost: number,
  mutableStratCmpl: StrategyComplete
) {
  if (!budget) return mutableStratCmpl;
  const numCcts = Math.floor(budget / -maxRiskCost);
  if (numCcts === 0) return null;
  for (const i in mutableStratCmpl.legsById)
    if (Object.prototype.hasOwnProperty.call(mutableStratCmpl.legsById, i)) {
      mutableStratCmpl.legsById[i].num =
        numCcts * (mutableStratCmpl.legsById[i].defaults?.num || 1);
    }
  return mutableStratCmpl;

  // * Immutable method

  // return set(
  //   lensProp('legsById'),
  //   mapObjIndexed(
  //     leg => set(lensProp('num'), numCcts * (leg.defaults?.num || 1), leg),
  //     mutableStratCmpl.legsById,
  //   ),
  //   mutableStratCmpl,
  // );
}
