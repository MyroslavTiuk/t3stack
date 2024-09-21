import { type FC, useCallback } from "react";
import React from "react";

import Box from "../../../../primitives/Box";
import T from "../../../../primitives/Typo";

import css from "./TradeToggle.module.scss";
import usePartialledCallback from "../../../../../../utils/Hooks/usePartialledCallback";
import Icon from "../../../../primitives/Icon";
import Button from "../../../../primitives/Button";
import useCustomHotkeysCalculator, {
  CalculatorKeys,
} from "../../utils/useCustomHotKeys";

type TradeToggleProps = {
  value: string;
  setValue: (newVal: string) => void;
  disabled?: boolean;
};

// const options = ["Buy", "Sell"];

const TradeToggle: FC<TradeToggleProps> = (
  props: TradeToggleProps
): ReturnType<typeof Box> => {
  const setToBuy = usePartialledCallback(props.setValue, ["Buy"]);
  const setToSell = usePartialledCallback(props.setValue, ["Sell"]);

  const toggle = useCallback(() => {
    props.setValue(props.value === "Buy" ? "Sell" : "Buy");
  }, [props.setValue, props.value]);

  useCustomHotkeysCalculator(CalculatorKeys.switchBetweenBuySell, () => {
    toggle();
  });

  return (
    <Box className={css.container} flexSec="baseline">
      {!props.value?.length ? (
        <>
          <T onClick={setToBuy} className={css.unselectedOption}>
            Buy
          </T>
          <T className={css.separator}>|</T>
          <T onClick={setToSell} className={css.unselectedOption}>
            Sell
          </T>
        </>
      ) : (
        <Button ghost onClick={toggle} flex-1 small className={css._holder}>
          <Box flexSec="center" className={css.toggleCenter}>
            <T className={css._toggle}>{props.value}</T>
            <Icon ctnrClassName={css._icon} icon="flip" xsmall />
          </Box>
        </Button>
        // <Box className={css._holder} onClick={toggle} flex-1>
        //
        //   {/*<Autocomplete items={options} value={props.value} onSelect={props.setValue} />*/}
        // </Box>
      )}
    </Box>
  );
};

export default TradeToggle;
