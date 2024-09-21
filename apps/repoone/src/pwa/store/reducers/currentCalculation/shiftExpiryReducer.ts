import { reduce, set, lensPath } from "ramda";

import { type CurrentCalculationState } from "opc-types/lib/store/CurrentCalculationState";
import getBestCurVol from "../../../../utils/Finance/getBestCurVol";
import { TIME_DECAY_BASIS } from "../../../../types/enums/TIME_DECAY_BASIS";
import getNearestExpiry from "../../../../utils/Finance/getNearestExpiry";

import type calculatorActions from "../../actions/calculator";
import { isStratLegOpt } from "../../../../utils/Finance/Strategy";
import updatePrices from "./updatePrices";

const shiftExpiryReducer = (
  state: CurrentCalculationState,
  {
    payload: {
      offset,
      meta: { prices },
    },
  }: ReturnType<typeof calculatorActions.shiftExpiry>
) => {
  if (!state) return state;
  const expiries = Object.keys(prices?.options || {});

  let updatedState = reduce(
    (updatedState_, legId) => {
      const curLeg = state.legsById[legId];
      if (!isStratLegOpt(curLeg)) {
        return updatedState_;
      }

      const { expiry: oldExpiry } = curLeg;
      if (!oldExpiry) {
        return updatedState_;
      }

      const oldExpKey = expiries.indexOf(oldExpiry);
      if (
        (offset === -1 && oldExpKey === 0) ||
        (offset === 1 && oldExpKey === expiries.length - 1)
      ) {
        return updatedState_;
      }
      const newExp = expiries[oldExpKey + offset];
      return set(
        lensPath(["legsById", legId, "expiry"]),
        newExp,
        updatedState_
      );
    },
    state,
    state.legs
  );

  updatedState = updatePrices(state, updatedState, prices);

  updatedState = set(
    lensPath(["atmIV"]),
    getBestCurVol(
      prices,
      { timeDecayBasis: /* todo */ TIME_DECAY_BASIS.CALENDAR_DAYS },
      getNearestExpiry(updatedState) || undefined
    ),
    updatedState
  );

  return updatedState;
};

export default shiftExpiryReducer;
