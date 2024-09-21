import { type Action } from "redux-actions";
import { ASYNC_STATUS } from "../../../types/enums/ASYNC_STATUS";
import { type AsyncData } from "opc-types/lib/store/AsyncData";
import { type AppErr } from "opc-types/lib/AppErr";
import { asyncData } from "../asyncData/asyncData";

export const createAsyncReducers = <StateType>(actionNameSnake: string) => ({
  [`${actionNameSnake}_PENDING`]: () =>
    asyncData<StateType>(ASYNC_STATUS.LOADING),

  [`${actionNameSnake}_FULFILLED`]: (
    _state: AsyncData<StateType>,
    action: Action<StateType>
  ) => asyncData(ASYNC_STATUS.COMPLETE, action.payload),

  [`${actionNameSnake}_REJECTED`]: (
    _state: AsyncData<StateType>,
    action: Action<AppErr[]>
  ) => asyncData<StateType>(ASYNC_STATUS.ERROR, action.payload),
});

export const makeCreateAsyncReducers =
  (ns: string) =>
  <StateType>(actionNameSnake: string) =>
    createAsyncReducers<StateType>(`${ns}/${actionNameSnake}`);
