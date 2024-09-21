import { reduce, set, lensPath } from "ramda";

import { type CurrentCalculationState } from "opc-types/lib/store/CurrentCalculationState";

import type calculatorActions from "../../actions/calculator";
import { isStratLegOpt } from "../../../../utils/Finance/Strategy";
import updatePrices from "./updatePrices";
import opTypeKey from "../../../../utils/String/opTypeKey/opTypeKey";

const shiftStrikeReducer = (
  state: CurrentCalculationState,
  {
    payload: {
      offset,
      meta: { prices },
    },
  }: ReturnType<typeof calculatorActions.shiftExpiry>
) => {
  if (!state) return state;

  let updatedState = reduce(
    (updatedState_, legId) => {
      const curLeg = state.legsById[legId];
      if (
        !isStratLegOpt(curLeg) ||
        !curLeg.expiry ||
        !curLeg.opType ||
        !curLeg.strike
      ) {
        return updatedState_;
      }
      const strikes = Object.keys(
        prices?.options[curLeg.expiry || ""]?.[opTypeKey(curLeg.opType)] || {}
      ).sort((a: string, b: string) => parseFloat(a) - parseFloat(b));
      const { strike: oldStrike } = curLeg;

      const oldStkKey = strikes.indexOf(oldStrike.toString());
      if (
        (offset === -1 && oldStkKey === 0) ||
        (offset === 1 && oldStkKey === strikes.length - 1)
      ) {
        return updatedState_;
      }
      const newStk = strikes[oldStkKey + offset];
      return set(
        lensPath(["legsById", legId, "strike"]),
        newStk,
        updatedState_
      );
    },
    state,
    state.legs
  );

  updatedState = updatePrices(state, updatedState, prices);

  return updatedState;
};

export default shiftStrikeReducer;
