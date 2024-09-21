import React, { type FC } from "react";

import { type OptionData } from "opc-types/lib/OptionData";
import { type PriceData } from "opc-types/lib/PriceData";
import { type Strategy } from "opc-types/lib/Strategy";
import { type PricesState } from "opc-types/lib/store/PricesState";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";
import calculatorActions from "../../../../store/actions/calculator";
import useDispaction from "../../../../../utils/Redux/useDispaction";
import { PRICE_RESULT } from "../../../../../types/enums/PRICE_RESULT";
import selectUnderlyingLeg from "../../../../store/selectors/currentCalculation/selectUnderlyingLeg";
import useResetStateVar from "../../../../../utils/Hooks/useResetStartVar";
import useReducerLocalSetter from "../../../../../utils/Hooks/useReducerLocalSetter";
import usePartialCB from "../../../../../utils/Hooks/usePartialCB";
import useSelectorSafe from "../../../../store/selectors/useSelectorSafe";
import { asyncData } from "../../../../../utils/Redux";
import useDependentMemo from "../../../../../utils/Hooks/useDependentMemo";
import formatOption from "../../../../../utils/String/formatOption/formatOption";
import opTypeKey from "../../../../../utils/String/opTypeKey/opTypeKey";
import { ASYNC_STATUS } from "../../../../../types/enums/ASYNC_STATUS";
import { useSession } from "../../Session/SessionProvider";

import useDispatchUpdateLegParam from "../utils/useDispatchUpdateLegParam";
import { getPricesByUnderlyingId } from "../utils/getPricesByUnderlyingId";
import { useStrategyCalculator } from "../StrategyCalculator.container";
import useStrikeChoices from "./utils/useStrikeChoices";
import usePriceChoices from "./utils/usePriceChoices";
import fmtLegStateToInput from "./utils/fmtLegStateToInput";
import fmtInputToState from "./utils/fmtInputToState";
import useExpiryChoices from "./utils/useExpiryChoices";
import useToggleOptionChain from "./utils/useToggleOptionChain";

import {
  type OptionLegProps,
  type OptionLegPublicProps,
  type OptionReducerState,
} from "./OptionLeg.props";
import OptionLegView from "./OptionLeg.view";
import selectBestInputMethod from "../../../../store/selectors/userSettings/selectBestInputMethod";
import usePartialledCallback from "../../../../../utils/Hooks/usePartialledCallback";

const STORE_KEYS: (keyof StratLegOpt | keyof Strategy)[] = [
  "name",
  "act",
  "price",
  "opType",
  "num",
  "strike",
  "expiry",
  "disabled",
  "iv",
  "showDetails",
  "showGreeks",
  "showExitPrice",
  "underlying",
];

const GLOBAL_KEYS: (keyof Strategy)[] = [
  "linkNum",
  "linkExpiries",
  "linkStrikes",
  "linkOpTypes",
];

const DIRECT_LEG_KEYS: (keyof StratLegOpt)[] = ["customPrice", "disabled"];

const DEPENDENT_LOCAL_KEYS: (keyof OptionReducerState)[] = [
  "act",
  "price",
  "opType",
  "num",
  "strike",
  "expiry",
  "disabled",
];

type CalcedHandlers = Pick<
  OptionLegProps,
  | "actOnChange"
  | "actOnSelect"
  | "priceOnChange"
  | "priceOnSelect"
  | "opTypeOnChange"
  | "opTypeOnSelect"
  | "numOnChange"
  | "numOnSelect"
  | "strikeOnChange"
  | "strikeOnSelect"
  | "expiryOnChange"
  | "expiryOnSelect"
  // | 'linkNumOnChange'
  | "linkNumOnSelect"
  // | 'linkExpiriesOnChange'
  | "linkExpiriesOnSelect"
  // | 'linkStrikesOnChange'
  | "linkStrikesOnSelect"
  // | 'linkOpTypesOnChange'
  | "linkOpTypesOnSelect"
  | "customPriceOnSelect"
  | "disabledOnSelect"
>;

const OptionLegContainer: FC<OptionLegPublicProps> = ({
  legId,
  leg,
  ofLegs,
}: OptionLegPublicProps) => {
  const {
    currentCalc,
    setFocusLinkedField,
    focusLinkedField,
    showChainForLeg,
    getSymbPrices,
  } = useStrategyCalculator();
  const { status: priceStatus } = useSelectorSafe<PricesState>(
    (store) => store.prices,
    asyncData<Record<string, PriceData>>(ASYNC_STATUS.LOADING, {})
  );
  const userSettings = useSession().userData.userSettings;
  const inputMethod = selectBestInputMethod(userSettings);
  const inputMethodMobile = selectBestInputMethod(userSettings, true);
  const layout = userSettings?.layout;
  const useShortDate = true; // inputMethod === 'inline';
  const removeLegId = useDispaction(calculatorActions.removeLeg);
  const removeLeg = usePartialledCallback(removeLegId, [legId]);

  const prices = useSelectorSafe(getPricesByUnderlyingId(leg.underlying));
  const optPrice = useSelectorSafe(
    () =>
      (prices &&
        prices.result === PRICE_RESULT.SUCCESS &&
        leg.opType &&
        // @ts-ignore
        (prices?.options?.[leg.expiry || ""]?.[opTypeKey(leg.opType)]?.[
          leg.strike || 0
        ] as OptionData)) ||
      null,
    null
  ) || {
    b: leg.priceRange[0] || 0,
    a: leg.priceRange[1] || 0,
    iv: leg.iv || undefined,
  };

  const strikeChoices = useStrikeChoices(
    prices,
    // @ts-ignore
    leg.expiry,
    currentCalc?.legsById || {},
    leg.opType
  );
  const priceChoices = usePriceChoices(
    prices,
    // @ts-ignore
    leg.expiry,
    leg.opType,
    leg.strike
  );
  const expiryChoices = useExpiryChoices(prices?.options || null, useShortDate);

  const savedState = STORE_KEYS.reduce(
    (acc, keyName) => ({
      ...acc,
      [keyName]: fmtLegStateToInput(keyName, leg, priceChoices, true),
    }),
    {} as OptionReducerState
  );

  const { update: updateLocal, state: localState } =
    useReducerLocalSetter<OptionReducerState>(
      STORE_KEYS.reduce(
        (acc, keyName) => ({
          ...acc,
          [keyName]: fmtLegStateToInput(keyName, leg, priceChoices, true),
        }),
        {} as OptionReducerState
      )
    );

  // Listen and reset local state variable when global state changes for dependent state variables
  DEPENDENT_LOCAL_KEYS.map((keyName) =>
    useResetStateVar(
      updateLocal,
      keyName,
      fmtLegStateToInput(keyName, leg, priceChoices, false, useShortDate)
    )
  );

  const optionCode = useDependentMemo(formatOption, [leg]);

  const updateGlobalParam = useDispatchUpdateLegParam(legId, currentCalc, {
    prices,
  });

  // todo: use multiHandlers like SpreadDetails uses
  const legPropHandlers = (DEPENDENT_LOCAL_KEYS as string[])
    .concat(DIRECT_LEG_KEYS)
    .reduce(
      (acc, keyName) => ({
        ...acc,
        [`${keyName}OnChange`]: usePartialCB(updateLocal, keyName),
        [`${keyName}OnSelect`]: usePartialCB(
          updateGlobalParam,
          ["legsById", legId, keyName],
          fmtInputToState(keyName as keyof StratLegOpt)
        ),
      }),
      {} as CalcedHandlers
    );

  const calcPropHandlers = GLOBAL_KEYS.reduce(
    (acc, keyName) => ({
      ...acc,
      // [`${keyName}OnChange`]: usePartialCB(updateLocal, keyName),
      [`${keyName}OnSelect`]: usePartialCB(
        updateGlobalParam,
        [keyName],
        fmtInputToState(keyName)
      ),
    }),
    {} as CalcedHandlers
  );

  const toggleOptionChain = useToggleOptionChain(legId);

  const legState = React.useMemo(
    () => ({
      ...localState,
      linkNum: currentCalc?.linkNum || false,
      linkExpiries: currentCalc?.linkExpiries || false,
      linkStrikes: currentCalc?.linkStrikes || false,
      linkOpTypes: currentCalc?.linkOpTypes || false,
    }),
    [
      localState,
      currentCalc?.linkNum,
      currentCalc?.linkExpiries,
      currentCalc?.linkStrikes,
      currentCalc?.linkOpTypes,
    ]
  );

  if (!currentCalc) return null;

  const viewProps: OptionLegProps = {
    legId,
    ofLegs,
    name: leg.name,
    leg: legState,
    layout,
    savedLeg: savedState,
    legSettings: leg.settings,
    curCalcLeg: leg,
    optionCode,
    optPrice,
    curCalc: currentCalc,
    getSymbPrices,
    strikeChoices,
    priceChoices,
    expiryChoices,
    toggleOptionChain,
    inputMethod,
    inputMethodMobile,
    priceLoading: priceStatus === ASYNC_STATUS.LOADING,
    stockNotSelected: !selectUnderlyingLeg(currentCalc)?.val,
    setFocusLinkedField,
    focusLinkedField,
    showChainForLeg,
    // * Input change handlers
    ...calcPropHandlers,
    ...legPropHandlers,
    removeLeg,
  };

  return <OptionLegView {...viewProps} />;
};

export default OptionLegContainer;
