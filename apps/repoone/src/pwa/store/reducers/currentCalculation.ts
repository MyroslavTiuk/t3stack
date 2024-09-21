import { lensPath, set } from "ramda";
import { handleActions } from "redux-actions";
import { type CurrentCalculationState } from "opc-types/lib/store/CurrentCalculationState";
import Strategies from "../../../model/Strategies";
import TransformStrategy from "../../../utils/Data/TransformStrategy/TransformStrategy";
import { presetReducers } from "../../../utils/Redux";
import calculatorActions from "../actions/calculator";
import commonActions from "../actions/common";
import priceActions from "../actions/prices";
import authActions from "../actions/auth";
import shiftExpiryReducer from "./currentCalculation/shiftExpiryReducer";
import { TIME_DECAY_BASIS } from "../../../types/enums/TIME_DECAY_BASIS";
import shiftStrikeReducer from "./currentCalculation/shiftStrikeReducer";
import updateParamReducer from "./currentCalculation/updateParamReducer";
import pricesAvailableForSymbolReducer from "./currentCalculation/pricesAvailableForSymbolReducer";
import calculationsActions from "../actions/calculations";
import addLegReducer from "./currentCalculation/addLegReducer";
import removeLegReducer from "./currentCalculation/removeLegReducer";
import deleteReducer from "./currentCalculation/deleteReducer";
import updateSpreadPriceReducer from "./currentCalculation/updateSpreadPriceReducer";

const DEFAULT_STATE: CurrentCalculationState = null;

const resetStateToDefault = presetReducers.makeReset(DEFAULT_STATE);

/**
 * Note on linkXyz properties.  These are saved on a per-leg basis, but when updating one, the current behaviour is to
 * update all legs values for that property.  This is inefficient and redundant (both for runtime processing as well as
 * in developing the codebase).  However, I'm reluctant to refactor this at this point, partly because it works :), but
 * also in case there is a need to allow linking of different sets of legs / turning on or off linking between some legs...
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer = handleActions<CurrentCalculationState, any>(
  {
    [String(calculatorActions.init)]: (
      _state,
      { payload }: ReturnType<typeof calculatorActions.init>
    ) => {
      return TransformStrategy.stratToInitialState(
        Strategies.getStrategy(payload.strat),
        {
          defaultSymbol: payload.symb,
          prices: payload.prices,
          defaultOptLegs: payload.defaultOptLegs,
          defaultDisplayValueType: payload.defaultDisplayValueType,
          timeDecayBasis: /* todo */ TIME_DECAY_BASIS.CALENDAR_DAYS,
        }
      );
    },
    [String(priceActions.pricesAvailableForSymbol)]:
      pricesAvailableForSymbolReducer,
    [String(calculatorActions.updateSpreadPrice)]: updateSpreadPriceReducer,
    [String(calculatorActions.updateParam)]: updateParamReducer,
    [String(calculatorActions.shiftExpiry)]: shiftExpiryReducer,
    [String(calculatorActions.shiftStrike)]: shiftStrikeReducer,
    [String(calculatorActions.resetCurrentCalc)]: resetStateToDefault,
    [String(commonActions.reset)]: resetStateToDefault,
    [String(authActions.logout)]: resetStateToDefault,
    [String(calculatorActions.setCurrentCalc)]:
      presetReducers.makeSetter<CurrentCalculationState>(),
    [String(calculationsActions.delete)]: deleteReducer,
    [String(calculatorActions.addLeg)]: addLegReducer,
    [String(calculatorActions.removeLeg)]: removeLegReducer,
    [String(calculatorActions.updatePermission)]: (state, { payload }) => {
      const updatedState = set(lensPath(["permission"]), payload, state);
      return updatedState;
    },
  },
  DEFAULT_STATE
);

export default reducer;
