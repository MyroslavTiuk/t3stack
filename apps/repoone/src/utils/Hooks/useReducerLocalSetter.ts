import { type Dispatch, useCallback, useMemo, useReducer } from "react";
import {
  makeTxfnActionCreator,
  makeTxfnReducer,
} from "../Redux/ReduxTxfn/redux-txfn";
import useDispaction from "../Redux/useDispaction";

function useReducerLocalSetter<S>(initState: S) {
  const localTxfnReducer = useMemo(() => makeTxfnReducer<S>(), []);
  const localTxfnAction = useMemo(() => makeTxfnActionCreator<S>(), []);

  const [state, dispatch]: [S, Dispatch<any>] = useReducer(
    localTxfnReducer,
    initState
  );

  const dispatchTxfn = useDispaction(localTxfnAction, dispatch);
  const update = useCallback(
    (key: string, val: S[keyof S]) => {
      dispatchTxfn((s) => ({ ...s, [key]: val }));
    },
    [dispatchTxfn]
  );

  return {
    update,
    state,
  };
}

export default useReducerLocalSetter;
