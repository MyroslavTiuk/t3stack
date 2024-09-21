import { handleActions } from "redux-actions";

import { asyncData } from "../../../utils/Redux";
import { type Action } from "opc-types/lib/store/Action";
import { type PricesState } from "opc-types/lib/store/PricesState";
import { ASYNC_STATUS } from "../../../types/enums/ASYNC_STATUS";

import priceActions from "../actions/prices";
import commonActions from "../actions/common";

const DEFAULT_STATE: PricesState = asyncData(ASYNC_STATUS.INITIAL);

const reducer = handleActions<PricesState, any>(
  {
    [String(priceActions.getPrice.pending)]: (state: PricesState) => {
      return asyncData(ASYNC_STATUS.LOADING, state.data);
    },
    [String(priceActions.getPrice.rejected)]: (
      state: PricesState,
      action: Action<any>
    ) => {
      return asyncData(ASYNC_STATUS.ERROR, action.payload, state.data);
    },
    [String(priceActions.getPrice.fulfilled)]: (
      state: PricesState,
      action: any
    ) => {
      const {
        symbol,
        ...resp
      }: Required<
        ReturnType<typeof priceActions.getPrice.fulfilled>
      >["payload"] = action.payload;
      return asyncData(ASYNC_STATUS.COMPLETE, {
        ...state.data,
        [symbol]: {
          retrievedTime: Date.now(),
          ...resp,
        },
      });
    },
    [String(commonActions.reset)]: () => DEFAULT_STATE,
  },
  DEFAULT_STATE
);

export default reducer;
