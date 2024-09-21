import React, { type FC } from "react";

import { lensProp, set } from "ramda";

import { type PriceData } from "opc-types/lib/PriceData";
import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { type PricesState } from "opc-types/lib/store/PricesState";
import { ASYNC_STATUS } from "../../../../../types/enums/ASYNC_STATUS";
import useReducerLocalSetter from "../../../../../utils/Hooks/useReducerLocalSetter";
import useResetStateVar from "../../../../../utils/Hooks/useResetStartVar";
import useSelectorSafe from "../../../../store/selectors/useSelectorSafe";
import { asyncData } from "../../../../../utils/Redux";
import usePartialCB from "../../../../../utils/Hooks/usePartialCB";
import useGetPrice from "../../../../../services/priceData/useGetPrice";

import { getPricesByUnderlyingId } from "../utils/getPricesByUnderlyingId";
import useDispatchUpdateLegParam from "../utils/useDispatchUpdateLegParam";
import fmtStateToInput from "./utils/fmtStateToInput";
import usePriceChoices from "./utils/usePriceChoices";
import fmtInputToState from "./utils/fmtInputToState";

import {
  type StockLegProps,
  type StockLegPublicProps,
  type StockReducerState,
} from "./StockLeg.props";
import StockLegView from "./StockLeg.view";
import selectPriceError from "../../../../store/selectors/prices/selectPriceError";
import { useStrategyCalculator } from "../StrategyCalculator.container";
import { FTUX_STAGES } from "../../../../../types/enums/FTUX_STAGES";
import { useSession } from "../../Session/SessionProvider";
import selectBestInputMethod from "../../../../store/selectors/userSettings/selectBestInputMethod";
import { useDispatch } from "react-redux";
import calcActions from "~/pwa/store/actions/calculator";

const STORE_LEG_KEYS: (keyof StratLegStock | "linkNum")[] = [
  "val",
  "act",
  "price",
  "num",
];

const DEPENDENT_LOCAL_KEYS: (keyof StockReducerState)[] = [
  "val",
  "act",
  "price",
  "num",
];
type CalcedHandlers = Pick<
  StockLegProps,
  | "valOnChange"
  | "valOnSelect"
  | "actOnChange"
  | "actOnSelect"
  | "priceOnChange"
  | "priceOnSelect"
  | "numOnChange"
  | "numOnSelect"
  | "linkNumOnSelect"
>;

const StockLegContainer: FC<StockLegPublicProps> = ({
  legId,
  leg,
  alwaysShowPricing,
}: StockLegPublicProps) => {
  const { status: storePriceStatus } = useSelectorSafe<PricesState>(
    (store) => store.prices,
    asyncData<Record<string, PriceData>>(ASYNC_STATUS.LOADING, {})
  );
  const priceError = useSelectorSafe(selectPriceError(leg.val));
  const prices = useSelectorSafe(getPricesByUnderlyingId(legId));
  const allPrices = useSelectorSafe((s) => s.prices.data);
  const curCalcStockPrices = leg.curPriceUpdated
    ? {
        last: leg.curPriceLast ?? null,
        bid: leg.curPriceBid ?? null,
        ask: leg.curPriceAsk ?? null,
      }
    : null;
  const chainAvailable = !!prices?.options;
  const pricesStock = prices?.stock || curCalcStockPrices || undefined;

  const priceStatus = leg.val !== "" ? storePriceStatus : ASYNC_STATUS.INITIAL;

  const {
    currentCalc,
    setFtuxStage,
    initialFtuxStage,
    setFocusLinkedField,
    focusLinkedField,
  } = useStrategyCalculator();
  const initialTipShow = !(initialFtuxStage & FTUX_STAGES.SEEN_SYMBOL_INPUT);
  const [shouldShowTip, setShouldShowTip] = React.useState(
    initialTipShow && (leg.val || "").length === 0
  );
  const hideTip = React.useCallback(() => {
    setFtuxStage(FTUX_STAGES.SEEN_SYMBOL_INPUT);
    setShouldShowTip(false);
  }, [setShouldShowTip, setFtuxStage]);

  const priceChoices = usePriceChoices(prices);

  const { update: updateLocal, state: localState } =
    useReducerLocalSetter<StockReducerState>(
      STORE_LEG_KEYS.reduce(
        (acc, keyName) => ({
          ...acc,
          [keyName]: fmtStateToInput(
            keyName,
            set(
              lensProp("linkNum"),
              currentCalc?.linkNum || false,
              leg as StratLegStock & { linkNum: boolean }
            ),
            true
          ),
        }),
        {} as StockReducerState
      )
    );
  const userSettings = useSession().userData.userSettings;
  const inputMethod = selectBestInputMethod(userSettings);
  const inputMethodMobile = selectBestInputMethod(userSettings, true);
  const lastRetrieved =
    useSelectorSafe(
      (store) =>
        // @ts-ignore (inside safe selector)
        store.prices.data[leg.val].time || undefined
    ) ||
    leg.curPriceUpdated ||
    undefined;

  const updateGlobal = useDispatchUpdateLegParam(legId, currentCalc, {
    prices,
  });
  const getPrice = useGetPrice();
  const dispatch = useDispatch();

  const fmtValInputToState = fmtInputToState("val");
  const valOnSelect = React.useCallback(
    (val: string) => {
      const strippedVal = fmtValInputToState(val);
      if (strippedVal !== leg.val || strippedVal === "") {
        dispatch(calcActions.resetMultiStrikes());
        dispatch(calcActions.setMultiStrike(false));
        updateGlobal(["legsById", legId, "val"], strippedVal, {
          prices: allPrices?.[strippedVal],
        });
      }
      console.log("updating symbol");
      if (strippedVal === "") {
        dispatch(calcActions.setCurrentCalcs([]));
        dispatch(calcActions.setCurrentCalcsStrategies([]));
      }
    },
    [updateGlobal, allPrices, legId, fmtValInputToState, leg.val]
  );

  React.useEffect(() => {
    if (!prices) {
      updateLocal("price", "");
    }
  }, [!!prices]);

  DEPENDENT_LOCAL_KEYS.map((keyName) =>
    useResetStateVar(
      updateLocal,
      keyName,
      fmtStateToInput(
        keyName,
        set(
          lensProp("linkNum"),
          currentCalc?.linkNum || false,
          leg as StratLegStock & { linkNum: boolean }
        )
      )
    )
  );

  const legHandlers = DEPENDENT_LOCAL_KEYS.reduce(
    (acc, keyName) => ({
      ...acc,
      [`${keyName}OnChange`]: usePartialCB(updateLocal, keyName),
      [`${keyName}OnSelect`]: usePartialCB(
        updateGlobal,
        ["legsById", legId, keyName],
        fmtInputToState(keyName)
      ),
    }),
    {} as CalcedHandlers
  );
  const calcHandlers = {
    linkNumOnSelect: usePartialCB(updateGlobal, ["linkNum"]),
  };

  const onPriceRefresh = React.useCallback(
    () => leg.val && getPrice(leg.val),
    [getPrice, leg.val]
  );

  const atmIV = useSelectorSafe((s) => s.currentCalculation?.atmIV, null);

  const legState = React.useMemo(
    () => ({
      ...localState,
      linkNum: currentCalc?.linkNum || false,
    }),
    [localState, currentCalc?.linkNum]
  );

  const viewProps: StockLegProps = {
    alwaysShowPricing: alwaysShowPricing || false,
    leg: legState,
    name: leg.name,
    settings: leg.settings,
    prices: pricesStock,
    priceError,
    inputMethod,
    inputMethodMobile,
    onPriceRefresh,
    lastRetrieved,
    priceStatus,
    chainAvailable,
    priceChoices,
    setFocusLinkedField,
    focusLinkedField,
    ...legHandlers,
    ...calcHandlers,
    valOnSelect,
    atmIV,
    shouldShowTip,
    hideTip,
  };

  return <StockLegView {...viewProps} />;
};

export default StockLegContainer;
