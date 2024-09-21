import { handleActions } from "redux-actions";
import { presetReducers } from "../../../utils/Redux";
import { type TokenState } from "opc-types/lib/store/TokenState";
import { authActions, tokenActions } from "../actions";
import commonActions from "../actions/common";

const DEFAULT_STATE: TokenState = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer = handleActions<TokenState, any>(
  {
    [String(tokenActions.updated)]: presetReducers.makeSetter<TokenState>(),
    [String(authActions.logout)]: presetReducers.empty,
    [String(commonActions.reset)]: () => DEFAULT_STATE,
  },
  DEFAULT_STATE
);

export default reducer;
