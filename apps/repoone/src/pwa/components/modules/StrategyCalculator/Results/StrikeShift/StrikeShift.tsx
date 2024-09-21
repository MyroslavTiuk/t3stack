import { pipe, sort, uniq } from "ramda";
import { ifNotNull } from "errable";
import { type FC, useContext } from "react";
import React from "react";

import { type Strategy } from "opc-types/lib/Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";

import { PRICE_RESULT } from "../../../../../../types/enums/PRICE_RESULT";
import Box from "../../../../primitives/Box";
import T from "../../../../primitives/Typo";
import InputLabelInline from "../../../../primitives/InputLabelInline/InputLabelInline";
import useSelectorSafe from "../../../../../store/selectors/useSelectorSafe";
import selectCurrentSymbolPrices from "../../../../../store/selectors/prices/selectCurrentSymbolPrices";
import { StrategyCalculatorContext } from "../../StrategyCalculator.container";
import useDispaction from "../../../../../../utils/Redux/useDispaction";
import { calculatorActions } from "../../../../../store/actions";
import { isStratLegOpt } from "../../../../../../utils/Finance/Strategy";
import pricesActions, {
  type PriceDataAndSymbol,
} from "../../../../../store/actions/prices";
import selectUnderlyingLeg from "../../../../../store/selectors/currentCalculation/selectUnderlyingLeg";

import css from "../ResultsMatrixToolbar/ResultsMatrixToolbar.module.scss";
import useCustomHotkeysCalculator, {
  CalculatorKeys,
} from "../../utils/useCustomHotKeys";
import { useDispatch } from "react-redux";
import calcActions from "~/pwa/store/actions/calculator";

type StrikeShiftProps = {
  disabled: boolean;
  calc?: Strategy;
  index?: number;
};

const selectCurCalcStrikes = (curCalc: Nullable<Strategy>) => {
  return pipe(
    () => curCalc,
    ifNotNull((concreteCurCalc) =>
      concreteCurCalc.legs.reduce((strikes, legId) => {
        const curLeg = concreteCurCalc.legsById[legId];
        return !isStratLegOpt(curLeg) || !curLeg.strike
          ? strikes
          : strikes.concat([curLeg.strike]);
      }, [] as number[])
    ),
    ifNotNull(uniq),
    ifNotNull(sort((a, b) => a - b)),
    ifNotNull((strikes) =>
      strikes.length === 0
        ? null
        : strikes.length === 1
        ? strikes[0].toString()
        : strikes.length === 2
        ? strikes.join("/")
        : `${strikes[0]}-${strikes[strikes.length - 1]}`
    )
  )();
};
const useStrikeShift = (
  calc: Nullable<Strategy> = null,
  index: Nullable<number> = null
) => {
  const prices = useSelectorSafe(
    (store) => selectCurrentSymbolPrices(store),
    null
  );
  const { currentCalcForResults: currentCalc } = useContext(
    StrategyCalculatorContext
  );

  const symbol = selectUnderlyingLeg(currentCalc)?.val;

  const dispatch = useDispatch();
  const multiStrike = useSelectorSafe((store) => store.multiStrike, null);
  function shiftMultiStrike(offset: number) {
    let newMultiStrike = multiStrike;
    const dates =
      prices.options[
        Object.keys(prices?.options).find(
          // @ts-ignore
          (p) => calc.legsById.option.expiry == p
        )
      ].p;
    const strikes = Object.keys(dates).map((s) => Number(s));
    const newStrike =
      // @ts-ignore
      strikes[strikes.indexOf(calc.legsById.option.strike) + offset];
    // @ts-ignore
    newMultiStrike[index].legsById.option.strike = newStrike;
    dispatch(calcActions.setStrikes(newMultiStrike));
  }
  const shiftStrike = useDispaction(calculatorActions.shiftStrike);
  const getPricesThenShiftStrike = useDispaction(
    pricesActions.getPricesThenDispatch
  );
  const onShiftStrike = React.useCallback(
    (offset: number) => {
      if (calc) {
        shiftMultiStrike(offset);
        return;
      }
      if (prices) {
        shiftStrike({ offset, meta: { prices } });
      } else if (symbol) {
        getPricesThenShiftStrike({
          symbol,
          dispatchCall: (prices: PriceDataAndSymbol) => {
            if (prices.result === PRICE_RESULT.SUCCESS) {
              shiftStrike({ offset, meta: { prices } });
            }
          },
        });
      }
    },
    [shiftStrike, prices, symbol, multiStrike]
  );
  const strikeDec = React.useCallback(() => onShiftStrike(-1), [onShiftStrike]);
  const strikeInc = React.useCallback(() => onShiftStrike(1), [onShiftStrike]);
  const curStrikes = selectCurCalcStrikes(currentCalc);

  return {
    strikeDec,
    strikeInc,
    curStrikes,
  };
};

const StrikeShift: FC<StrikeShiftProps> = ({
  disabled,
  calc,
  index,
}: StrikeShiftProps) => {
  const logic = useStrikeShift(calc, index);

  useCustomHotkeysCalculator(CalculatorKeys.increaseStrikePrice, () => {
    logic.strikeInc();
  });

  useCustomHotkeysCalculator(CalculatorKeys.decreaseStrikePrice, () => {
    logic.strikeDec();
  });
  // const currMultiStrike =
  // const dispatch = useDispatch();
  // const currentMultiStrikes = useSelectorSafe((s) => s.multiStrike, null);
  // dispatch(
  //   calcActions.addStrike(
  //
  //   )
  // )

  return (
    <InputLabelInline
      label={"Strike"}
      className={[css.strikeCtnr, "mr-1-2"]}
      disabled={disabled}
    >
      <Box
        flex
        className={[
          css._strike,
          "--sec-center",
          disabled && css.disabledWrapper,
        ]}
      >
        <Box
          onClick={logic.strikeDec}
          flex-center
          className={css.plusMinusButton}
        >
          <T tagName="span">–</T>
        </Box>
        <T
          content-pragmatic
          className={["align-center", css._strikeText, css.shifterCurValText]}
        >
          {/*@ts-ignore*/}
          {calc ? calc.legsById.option.strike : logic.curStrikes || "-"}
        </T>
        <Box
          onClick={logic.strikeInc}
          flex-center
          className={css.plusMinusButton}
        >
          <T tagName="span">+</T>
        </Box>
      </Box>
    </InputLabelInline>
  );
};

export default StrikeShift;
