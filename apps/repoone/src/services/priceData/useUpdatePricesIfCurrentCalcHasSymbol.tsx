import { useEffect, useState } from "react";
import { always } from "ramda";
import { useRouter } from "next/router";
import { type Optional } from "opc-types/lib/util/Optional";

import { ASYNC_STATUS } from "../../types/enums/ASYNC_STATUS";
import useSelectorSafe from "../../pwa/store/selectors/useSelectorSafe";
import selectUnderlyingLeg from "../../pwa/store/selectors/currentCalculation/selectUnderlyingLeg";
import selectSymbolPrices from "../../pwa/store/selectors/prices/selectSymbolPrices";
import priceActions from "../../pwa/store/actions/prices";
import useDispaction from "../../utils/Redux/useDispaction";
import useLocationParams from "../../utils/Hooks/useLocationParams";
import arePricesOutOfDate from "../../utils/Finance/arePricesOutOfDate";
import selectCurrentCalculation from "../../pwa/store/selectors/currentCalculation/selectCurrentCalculation";

import useGetPrice from "./useGetPrice";

function useCalcParams() {
  const router = useRouter();
  return {
    code: router.query.code,
    trade: router.query.trade,
  };
}

// todo: Consider moving to redux-listener
const useUpdatePricesIfCurrentCalcHasSymbol = () => {
  const curSymb = useSelectorSafe(
    (store) => selectUnderlyingLeg(store.currentCalculation)?.val
  );
  const curCalcId = useSelectorSafe(selectCurrentCalculation)?.id;
  const [lastSymb, setLastSymb] = useState("");
  const curSymbPrices = useSelectorSafe(
    curSymb ? selectSymbolPrices(curSymb) : always(undefined)
  );
  const priceStatus = useSelectorSafe(
    (state) => state.prices.status,
    ASYNC_STATUS.INITIAL
  );
  const getPrice = useGetPrice();
  const dispatchPricesAvailableForSymbol = useDispaction(
    priceActions.pricesAvailableForSymbol
  );
  const { trade } = useCalcParams();
  const source = useLocationParams()?.source as Optional<string>;

  useEffect(() => {
    if (
      curSymb &&
      curSymb !== lastSymb &&
      !curCalcId &&
      (!curSymbPrices ||
        !curSymbPrices?.options ||
        !curSymbPrices?.retrievedTime ||
        [ASYNC_STATUS.ERROR, ASYNC_STATUS.INITIAL].includes(priceStatus) ||
        arePricesOutOfDate(curSymbPrices)) &&
      priceStatus !== ASYNC_STATUS.LOADING
    ) {
      getPrice(curSymb, {
        autoRefresh: !curCalcId,
        refreshPriceRangeOnly: !!trade,
        fillPriceIfBlank: !!trade,
      });
      setLastSymb(curSymb);
    } else if (
      curSymb &&
      curSymb !== lastSymb &&
      curSymbPrices &&
      curSymbPrices.options &&
      priceStatus === ASYNC_STATUS.COMPLETE
    ) {
      setLastSymb(curSymb);
      if (source !== "finder") {
        dispatchPricesAvailableForSymbol({
          symbol: curSymb,
          ...curSymbPrices,
          fromUUPICCHS: true,
        });
      }
    }
  }, [curSymb, lastSymb, curSymbPrices, priceStatus]);
};

export const UseUpdatePricesIfCurrentCalcHasSymbol = () => {
  useUpdatePricesIfCurrentCalcHasSymbol();

  return <></>;
};

export default useUpdatePricesIfCurrentCalcHasSymbol;
