import type { CurrentCalculationQuickView } from "../../../../opc-types/lib/store/CurrentCalculationState";
import { handleActions } from "redux-actions";
import calcActions from "~/pwa/store/actions/calculator";

const DEFAULT_STATE: CurrentCalculationQuickView[] = [];

// const resetStateToDefault = presetReducers.makeReset(DEFAULT_STATE);

const reducer = handleActions<CurrentCalculationQuickView[], any>(
  {
    [String(calcActions.setCurrentCalcsStrategies)]: (state, { payload }) =>
      payload,
    [String(calcActions.resetCurrentCalcsStrategies)]: (_state) => {
      return [];
    },
  },
  DEFAULT_STATE
);

export default reducer;
