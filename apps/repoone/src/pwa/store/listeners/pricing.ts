import { type ReduxListener } from "redux-listeners";
import pricesActions, { type PriceDataAndSymbol } from "../actions/prices";
import { getPayload } from "./helpers";
import { getPrice } from "../../../services/priceData/useGetPrice";

const pricingListeners: [string, ReduxListener][] = [
  [
    pricesActions.getPricesThenDispatch.toString(),
    (_dispatch, action) => {
      const payload = getPayload(pricesActions.getPricesThenDispatch, action);
      getPrice(_dispatch, payload.symbol)
        .then((prices: PriceDataAndSymbol) => {
          payload.dispatchCall(prices);
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {});
    },
  ],
];

export default pricingListeners;
