import axios from "axios";
import { type Dispatch } from "redux";
import { useDispatch } from "react-redux";

import { type PriceDataResp } from "opc-types/lib/api/responses/PriceDataResp";

import { PRICE_RESULT } from "../../types/enums/PRICE_RESULT";
import { SITE } from "../../config/Site";
import withApiResponseData from "../../utils/Data/withApiResponseData/withApiResponseData";
import priceActions from "../../pwa/store/actions/prices";
import pricesActions from "../../pwa/store/actions/prices";

const getPriceData = (symbol: string, meta = {}) => {
  return withApiResponseData<PriceDataResp>(
    axios.get(`${SITE.API_URL}/price/${symbol}`)
  )
    .then((data) => {
      if (data.result !== PRICE_RESULT.SUCCESS) {
        throw { error: data.result };
      }
      const priceDataAndSymbol = {
        ...data,
        meta,
        symbol,
      };
      return priceDataAndSymbol;
    })
    .catch((errors) => {
      if (errors.message !== undefined) {
        throw [{ error: errors.message, symbol }];
      }
      throw [
        {
          ...errors,
          symbol,
        },
      ];
    });
};

export const getPrice = (dispatch: Dispatch, symbol: string, meta = {}) => {
  dispatch(priceActions.getPrice.pending());
  return getPriceData(symbol, meta)
    .then((priceDataAndSymbol) => {
      dispatch(pricesActions.pricesAvailableForSymbol(priceDataAndSymbol));
      dispatch(pricesActions.getPrice.fulfilled(priceDataAndSymbol));
      return priceDataAndSymbol;
    })
    .catch((e) => {
      dispatch(pricesActions.getPrice.rejected(e));
      throw e;
    });
};

const useGetPrice = () => {
  const dispatch = useDispatch();
  return (symbol: string, meta = {}) => getPrice(dispatch, symbol, meta);
};

export default useGetPrice;
