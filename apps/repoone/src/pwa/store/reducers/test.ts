import { handleActions } from "redux-actions";

import { type TestState } from "opc-types/lib/store/TestState";
import { makeTxfnReducer } from "../../../utils/Redux/ReduxTxfn/redux-txfn";

const DEFAULT_STATE: TestState = { a: 1 };

export const NS = "TEST";

const reducer = makeTxfnReducer(
  NS,
  handleActions<TestState, any>({}, DEFAULT_STATE)
);

export default reducer;
