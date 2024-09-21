import { handleActions } from "redux-actions";
// import { asyncData, createAsyncReducers, presetReducers } from 'utils/Redux';

import { type AuthStatusState } from "opc-types/lib/store/AuthStatusState";
import commonActions from "../actions/common";
import { AUTH_STATUS } from "../../components/modules/Session/Session.types";

// import { ...Actions } from '../actions';

const DEFAULT_STATE: AuthStatusState = AUTH_STATUS.STATE_LOADING; // asyncData(ASYNC_STATUS.INITIAL);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer = handleActions<AuthStatusState, any>(
  {
    // ...createAsyncReducers<AuthStatus[]>('EXAMPLE/GET_LISTINGS'),
    // [String(authActions.logout)]: presetReducers.makeReset(DEFAULT_STATE),
    [String(commonActions.reset)]: () => DEFAULT_STATE,
  },
  DEFAULT_STATE
);

export default reducer;
