// import { asyncData, createAsyncReducers, presetReducers } from 'utils/Redux';

import { type CalculationsState } from "opc-types/lib/store/CalculationsState";
import handleActions, {
  handleActionReducer,
} from "../../../utils/Redux/handleActions/handleActions";

import calculationsActions from "../actions/calculations";
import presetReducers from "../../../utils/Redux/presetReducers/presetReducers";
import presetPayloadReducers from "../../../utils/Redux/presetPayloadReducers/presetPayloadReducers";
import { authActions } from "../actions";

const DEFAULT_STATE: CalculationsState = [];

const reducer = handleActions<CalculationsState>(
  [
    handleActionReducer(
      calculationsActions.reset,
      presetReducers.makeReset(DEFAULT_STATE)
    ),
    handleActionReducer(
      calculationsActions.setAll,
      presetPayloadReducers.makeSetter()
    ),
    handleActionReducer(calculationsActions.appendAll, (s, p) => s.concat(p)),
    handleActionReducer(
      calculationsActions.upsert,
      presetPayloadReducers.makeUpsertOnProp("id")
    ),
    handleActionReducer(
      authActions.authenticated,
      presetReducers.makeReset(DEFAULT_STATE)
    ),
    handleActionReducer(
      authActions.logout,
      presetReducers.makeReset(DEFAULT_STATE)
    ),
    handleActionReducer(calculationsActions.delete, (state, payload) =>
      state.filter((calc) => calc.id !== payload)
    ),
  ],
  DEFAULT_STATE
);

export default reducer;
