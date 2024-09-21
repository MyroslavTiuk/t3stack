import type { CurrentCalculationState } from "../../../../opc-types/lib/store/CurrentCalculationState";
import { handleActions } from "redux-actions";
import calcActions from "~/pwa/store/actions/calculator";

const DEFAULT_STATE: CurrentCalculationState[] = [];

// const resetStateToDefault = presetReducers.makeReset(DEFAULT_STATE);

const reducer = handleActions<CurrentCalculationState[], any>(
  {
    [String(calcActions.setCurrentCalcs)]: (state, { payload }) => payload,
  },
  DEFAULT_STATE
);

export default reducer;
