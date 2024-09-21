import React, { type FC } from "react";

import { type Strategy } from "opc-types/lib/Strategy";
import SpreadDetailsView from "./SpreadDetails.view";

import { ASYNC_STATUS } from "../../../../../types/enums/ASYNC_STATUS";
import useSelectorSafe from "../../../../store/selectors/useSelectorSafe";
import { getPricesByUnderlyingId } from "../utils/getPricesByUnderlyingId";
import useReducerLocalSetter from "../../../../../utils/Hooks/useReducerLocalSetter";
import useResetStateVar from "../../../../../utils/Hooks/useResetStartVar";
import { type PriceData } from "opc-types/lib/PriceData";
import { type PricesState } from "opc-types/lib/store/PricesState";

import useExpiryChoices from "../OptionLeg/utils/useExpiryChoices";
import fmtStateToInput from "./helpers/fmtStateToInput";
import fmtInputToState from "./helpers/fmtInputToState";

import {
  type SpreadDetailsProps,
  type SpreadDetailsPublicProps,
  type SpreadDetailsState,
} from "./SpreadDetails.props";
import useStrikeChoices from "../OptionLeg/utils/useStrikeChoices";
import type StrikeChoice from "../OptionLeg/types/StrikeChoice";
import useDispaction from "../../../../../utils/Redux/useDispaction";
import calculatorActions from "../../../../store/actions/calculator";
import useDispatchUpdateLegParam from "../utils/useDispatchUpdateLegParam";
import useDependentMemo from "../../../../../utils/Hooks/useDependentMemo";
import { asyncData } from "../../../../../utils/Redux";
import { useStrategyCalculator } from "../StrategyCalculator.container";

const calculateState = (calc: Strategy): SpreadDetailsState => ({
  num: fmtStateToInput("num", calc),
  expiry: fmtStateToInput("expiry", calc),
  strike: fmtStateToInput("strike", calc),
  opType: fmtStateToInput("opType", calc),
});

const DEPENDENT_LOCAL_KEYS: (keyof SpreadDetailsState)[] = [
  "num",
  "expiry",
  "strike",
  "opType",
];
const LEG_FIELDS = DEPENDENT_LOCAL_KEYS as string[];

const SpreadDetailsContainer: FC<SpreadDetailsPublicProps> = (
  props: SpreadDetailsPublicProps
) => {
  const { setFocusLinkedField, getSymbPrices, focusLinkedField } =
    useStrategyCalculator();
  const { status: priceStatus } = useSelectorSafe<PricesState>(
    (store) => store.prices,
    asyncData<Record<string, PriceData>>(ASYNC_STATUS.LOADING, {})
  );
  const prices = useSelectorSafe(getPricesByUnderlyingId(), null);

  const { state: localState, update: updateLocal } = useReducerLocalSetter(
    calculateState(props.currentCalc)
  );
  const savedSpreadVals = useDependentMemo(calculateState, [props.currentCalc]);

  // Listen and reset local state variable when global state changes for dependent entries
  DEPENDENT_LOCAL_KEYS.map((keyName) =>
    useResetStateVar<SpreadDetailsState>(
      updateLocal,
      keyName,
      fmtStateToInput(keyName, props.currentCalc)
    )
  );
  const updateLegGlobal = useDispatchUpdateLegParam("", undefined, {
    linkedUpdate: true,
    prices,
  });
  const updateCalcGlobal = useDispaction(calculatorActions.updateParam);

  const calc = props.currentCalc;
  const onToggleAll = React.useCallback(
    (onOff: boolean) => {
      // @ts-ignore
      updateCalcGlobal({ paramChain: ["linkNum"], paramValue: onOff });
      calc.defaults.linkExpiries &&
        // @ts-ignore
        updateCalcGlobal({ paramChain: ["linkExpiries"], paramValue: onOff });
      calc.defaults.linkStrikes &&
        // @ts-ignore
        updateCalcGlobal({ paramChain: ["linkStrikes"], paramValue: onOff });
      calc.defaults.linkOpTypes &&
        // @ts-ignore
        updateCalcGlobal({ paramChain: ["linkOpTypes"], paramValue: onOff });
      !calc.defaults.changeOpType &&
        // @ts-ignore
        updateCalcGlobal({ paramChain: ["changeOpType"], paramValue: !onOff });
      !calc.defaults.changeAct &&
        // @ts-ignore
        updateCalcGlobal({ paramChain: ["changeAct"], paramValue: !onOff });
    },
    [
      updateCalcGlobal /* props.currentCalc.changeOpType, props.currentCalc.changeAct, */,
      calc?.linkExpiries,
      calc?.linkStrikes,
      calc?.linkOpTypes,
      calc?.changeOpType,
      calc?.changeAct,
    ]
  );

  const expiryChoices = useExpiryChoices(prices?.options || null);
  const strikeChoices: StrikeChoice[] = useStrikeChoices(
    prices || undefined,
    localState.expiry || null,
    calc.legsById || {},
    null
  );

  const onBlurMultiHandler = React.useCallback(
    (val: string | boolean, evt: React.SyntheticEvent<HTMLElement>) => {
      // @ts-ignore (dataset seems to exist on target)
      // eslint-disable-next-line no-unsafe-optional-chaining
      const { fieldId } = evt.target?.dataset;
      updateLegGlobal(
        LEG_FIELDS.includes(fieldId)
          ? ["legsById", "_SPREAD", fieldId]
          : [fieldId],
        fmtInputToState(fieldId as keyof SpreadDetailsState)(val as any)
      );
    },
    [updateLegGlobal]
  );
  const onChangeMultiHandler = React.useCallback(
    (val: string | boolean, evt: React.SyntheticEvent<HTMLElement>) => {
      // @ts-ignore (dataset seems to exist on target)
      updateLocal(evt.target?.dataset?.fieldId, val);
    },
    [updateLocal]
  );

  const spreadVals = React.useMemo(
    () => ({
      ...localState,
      linkExpiries: props.currentCalc.linkExpiries,
      linkNum: props.currentCalc.linkNum,
      linkOpTypes: props.currentCalc.linkOpTypes,
      linkStrikes: props.currentCalc.linkStrikes,
    }),
    [
      localState,
      props.currentCalc.linkExpiries,
      props.currentCalc.linkNum,
      props.currentCalc.linkOpTypes,
      props.currentCalc.linkStrikes,
    ]
  );

  const viewProps: SpreadDetailsProps = {
    currentCalc: props.currentCalc, // todo: trim down to .settings if can do so
    spreadVals,
    savedSpreadVals,
    opLegCount: props.opLegCount,
    multiOnBlur: onBlurMultiHandler,
    multiOnChange: onChangeMultiHandler,
    expiryChoices,
    strikeChoices,
    onToggleAll,
    pricesLoading: priceStatus === ASYNC_STATUS.LOADING,
    setFocusLinkedField,
    focusLinkedField,
    getSymbPrices,
  };

  return <SpreadDetailsView {...viewProps} />;
};

export default SpreadDetailsContainer;
