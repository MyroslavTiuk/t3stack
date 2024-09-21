import React, { type FC, useContext } from "react";

import { type Nullable } from "opc-types/lib/util/Nullable";
import { type Strategy } from "opc-types/lib/Strategy";

import { codeToExp } from "../../../../../../utils/String/DateFormat/DateFormat";
import InputLabelInline from "../../../../primitives/InputLabelInline/InputLabelInline";
import Box from "../../../../primitives/Box";
import T from "../../../../primitives/Typo";
import useSelectorSafe from "../../../../../store/selectors/useSelectorSafe";
import selectCurrentSymbolPrices from "../../../../../store/selectors/prices/selectCurrentSymbolPrices";
import useDispaction from "../../../../../../utils/Redux/useDispaction";
import { calculatorActions } from "../../../../../store/actions";
import pricesActions, {
  type PriceDataAndSymbol,
} from "../../../../../store/actions/prices";
import { isStratLegOpt } from "../../../../../../utils/Finance/Strategy";
import { isNull } from "errable";
import { StrategyCalculatorContext } from "../../StrategyCalculator.container";

import css from "../ResultsMatrixToolbar/ResultsMatrixToolbar.module.scss";
import selectUnderlyingLeg from "../../../../../store/selectors/currentCalculation/selectUnderlyingLeg";
import { PRICE_RESULT } from "../../../../../../types/enums/PRICE_RESULT";
import useCustomHotkeysCalculator, {
  CalculatorKeys,
} from "../../utils/useCustomHotKeys";

type ExpiryShiftProps = {
  disabled: boolean;
};

const selectCurCalcFirstExpiry = (curCalc: Nullable<Strategy>) => {
  return (
    (curCalc &&
      curCalc.legs.reduce((closestExpiry, legId) => {
        const curLeg = curCalc.legsById[legId];
        return !isStratLegOpt(curLeg) || !curLeg.expiry
          ? closestExpiry
          : isNull(closestExpiry)
          ? curLeg.expiry
          : curLeg.expiry > closestExpiry
          ? curLeg.expiry
          : closestExpiry;
      }, null as Nullable<string>)) ||
    null
  );
};

const useExpiryShift = () => {
  const prices = useSelectorSafe(
    (store) => selectCurrentSymbolPrices(store),
    null
  );
  const { currentCalcForResults: currentCalc } = useContext(
    StrategyCalculatorContext
  );

  const symbol = selectUnderlyingLeg(currentCalc)?.val;

  const shiftExpiry = useDispaction(calculatorActions.shiftExpiry);
  const getPricesThenShiftExpiry = useDispaction(
    pricesActions.getPricesThenDispatch
  );
  const onShiftExpiry = React.useCallback(
    (offset: number) => {
      if (prices) {
        shiftExpiry({ offset, meta: { prices } });
      } else if (symbol) {
        getPricesThenShiftExpiry({
          symbol,
          dispatchCall: (prices: PriceDataAndSymbol) => {
            if (prices.result === PRICE_RESULT.SUCCESS) {
              shiftExpiry({ offset, meta: { prices } });
            }
          },
        });
      }
    },
    [shiftExpiry, prices, symbol]
  );
  const expiryDec = React.useCallback(() => onShiftExpiry(-1), [onShiftExpiry]);
  const expiryInc = React.useCallback(() => onShiftExpiry(1), [onShiftExpiry]);

  const firstExpiry = selectCurCalcFirstExpiry(currentCalc);

  return {
    expiryDec,
    expiryInc,
    firstExpiry,
  };
};

const ExpiryShift: FC<ExpiryShiftProps> = (
  props: ExpiryShiftProps
): ReturnType<typeof Box> => {
  const logic = useExpiryShift();

  useCustomHotkeysCalculator(CalculatorKeys.higherExpirationDate, () => {
    logic.expiryInc();
  });

  useCustomHotkeysCalculator(CalculatorKeys.lowerExpirationDate, () => {
    logic.expiryDec();
  });

  return (
    <InputLabelInline
      label={"Expiry"}
      className={[css.expiryCtnr, "mr-1-2"]}
      disabled={props.disabled}
    >
      <Box
        flex
        className={[
          css._expiry,
          "--sec-center",
          props.disabled && css.disabledWrapper,
        ]}
      >
        <Box onClick={logic.expiryDec} className={css.leftArrow} />
        <T
          content-pragmatic
          className={["align-center", css._expiryText, css.shifterCurValText]}
        >
          {logic.firstExpiry ? codeToExp(logic.firstExpiry, true) : "-"}
        </T>
        <Box onClick={logic.expiryInc} className={css.rightArrow} />
      </Box>
    </InputLabelInline>
  );
};

export default ExpiryShift;
