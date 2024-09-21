import { type FC } from "react";
import React from "react";

import Box from "../../../primitives/Box";
import T from "../../../primitives/Typo";
import Input from "../../../primitives/Input";
import GreekPanel from "../../../primitives/GreekPanel";
import Slider from "../../../primitives/Slider";
import ExpandableGroupView from "../../../primitives/ExpandableGroup/ExpandableGroup.view";

import entryCss from "../Entry/Entry.module.scss";
import { usePriceSliderProps } from "../OptionLeg/utils/usePriceSliderProps";
import { type NetSummaryProps } from "./NetSummary.props";

import useToggleState from "../../../../../utils/Hooks/useToggleState";
import round from "../../../../../utils/Data/round/round";
import { isNull } from "errable";
import { makeFormatPrice } from "../../../../../utils/String/formatPrice/formatPrice";
import useDebounceEffect from "../../../../../utils/Hooks/useDebounceEffect";

// const FALLBACK_TO_INPUT = false;

const formatPriceNum = makeFormatPrice({ hideDollar: true, hideMinus: false });

const NetSummaryView: FC<NetSummaryProps> = (
  props: NetSummaryProps
): ReturnType<typeof Box> => {
  const [spreadPriceDisplayVal, setSpreadPriceDisplayVal] = React.useState(
    props.spreadPriceAsPerLegs ? formatPriceNum(props.spreadPriceAsPerLegs) : ""
  );
  const onSet = React.useCallback(
    (val: string) => {
      // if val is different to spreadPriceAsPerLegs
      const num = parseFloat(val);
      if (
        num &&
        (props.spreadPriceAsPerLegs === null ||
          num !== props.spreadPriceAsPerLegs)
      ) {
        props.setSpreadPrice(num);
      }
    },
    [props.setSpreadPrice, props.spreadPriceAsPerLegs]
  );

  const priceSliderProps = usePriceSliderProps({
    range: props.spreadPriceRangeAsPerLegs,
    val:
      isNull(spreadPriceDisplayVal) ||
      (props.spreadPriceRangeAsPerLegs[0] !== null &&
        parseFloat(spreadPriceDisplayVal) <
          props.spreadPriceRangeAsPerLegs[0]) ||
      (props.spreadPriceRangeAsPerLegs[1] !== null &&
        parseFloat(spreadPriceDisplayVal) > props.spreadPriceRangeAsPerLegs[1])
        ? null
        : parseFloat(spreadPriceDisplayVal),
    onChange: (v) => {
      props.setSpreadPrice(v);
    },
    onUpdate: (v: number) => setSpreadPriceDisplayVal(round(v, 2).toString()),
    showMinus: true,
    showTag: false,
  });
  const {
    value: priceHasFocus,
    enable: spreadFocus,
    disable: spreadBlur,
  } = useToggleState(false);

  useDebounceEffect(
    () => {
      const newVal = parseFloat(spreadPriceDisplayVal);
      priceHasFocus &&
        (props.spreadPriceAsPerLegs === null ||
          newVal !== props.spreadPriceAsPerLegs) &&
        props.setSpreadPrice(newVal);
    },
    [priceHasFocus, spreadPriceDisplayVal, props.spreadPriceAsPerLegs],
    500
  );

  React.useEffect(() => {
    if (!priceHasFocus) {
      setSpreadPriceDisplayVal(
        props.spreadPriceAsPerLegs === null
          ? ""
          : formatPriceNum(props.spreadPriceAsPerLegs)
      );
    }
  }, [!priceHasFocus && props.spreadPriceAsPerLegs]);
  const onPriceChange = React.useCallback(
    (v: string) => {
      setSpreadPriceDisplayVal(v);
    },
    [priceHasFocus, setSpreadPriceDisplayVal]
  );
  const fmtPriceDispVal = priceHasFocus
    ? spreadPriceDisplayVal
    : parseFloat(spreadPriceDisplayVal).toFixed(2);

  return (
    <Box className={[entryCss["fields-ctnr"], entryCss[`--stacked`]]}>
      <Box
        className={[
          entryCss["input-group"],
          entryCss["--long-label"],
          entryCss["input-row-line"],
          entryCss["--id-net-summary"],
        ]}
      >
        <T
          className={[entryCss["_label"]]}
          tagName="label"
          htmlFor={`_legsNet_price`}
        >
          Spread price
        </T>
        <Box
          className={[entryCss["_input"]]}
          flexSec={"center"}
          flexPri={"start"}
        >
          {props.spreadPriceAsPerLegs === null ? (
            <T content-hint>Select all option legs</T>
          ) : (
            <>
              <Input
                className={[entryCss["_custom-text"]]}
                inputClassName={[
                  entryCss["_entry-input"],
                  entryCss["--has-prefix"],
                ]}
                placeholder={""}
                onChange={onPriceChange}
                onSet={onSet}
                onFocus={spreadFocus}
                onBlur={spreadBlur}
                value={fmtPriceDispVal || ""}
                inputId={`_legsNet_price`}
                autoComplete="off"
                prefix={"$"}
              />
              <Box flex-1 style={{ maxWidth: "10em" }}>
                <Slider {...priceSliderProps} />
              </Box>
            </>
          )}
        </Box>
      </Box>
      <ExpandableGroupView
        groups={{
          "Net Greeks": <GreekPanel greeks={props.greeks} />,
        }}
      />
    </Box>
  );
};

export default NetSummaryView;
