import React, { type FC } from "react";

import { MATRIX_YAXIS_TYPES } from "../../../../../../../types/enums/MATRIX_YAXIS_TYPES";
import noop from "../../../../../../../utils/Functional/noop";
import type Box from "../../../../../primitives/Box";
import Autocomplete from "../../../../../primitives/Autocomplete";

import css from "./RightYAxisOption.module.scss";

type RightYAxisOptionProps = {
  selectedType: MATRIX_YAXIS_TYPES;
  onChange: (val: MATRIX_YAXIS_TYPES) => void;
};

type AxisOpt = {
  val: MATRIX_YAXIS_TYPES;
  desc: string;
  fullDesc: string;
};

const AUTOCOMPLETE_OPTIONS: AxisOpt[] = [
  {
    val: MATRIX_YAXIS_TYPES.DISTANCE_FROM_CURRENT,
    desc: "Move",
    fullDesc: "Move from current price",
  },
  {
    val: MATRIX_YAXIS_TYPES.PROB_FINISH_OUTSIDE,
    desc: "Fin. %",
    fullDesc: "Probability finish outside",
  },
  // {
  //   val: MATRIX_YAXIS_TYPES.PROB_TOUCH,
  //   desc: 'Touch %',
  //   fullDesc: 'Probability touching price',
  // },
  {
    val: MATRIX_YAXIS_TYPES.STOCK_PRICE,
    desc: "Price",
    fullDesc: "Stock price",
  },
];

const descOfType = (type: MATRIX_YAXIS_TYPES) =>
  AUTOCOMPLETE_OPTIONS.find((opt) => opt.val === type)?.desc || "";

const RightYAxisOption: FC<RightYAxisOptionProps> = (
  props: RightYAxisOptionProps
): ReturnType<typeof Box> => {
  const [val, setVal] = React.useState(props.selectedType);

  const getItemValue = React.useCallback((item: AxisOpt) => item.fullDesc, []);
  const getItemId = React.useCallback((item: AxisOpt) => item.val, []);
  const onSelect = React.useCallback(
    (val: string, item?: AxisOpt) => {
      item && props.onChange(item.val);
      item && setVal(item.val);
    },
    [props.onChange, getItemValue]
  );

  return (
    <Autocomplete
      className={css.autocomplete}
      dropdownClassName={css.dropdown}
      noTypoStylesOnInput
      inputProps={{
        inputClassName: css.input,
        noUnderline: true,
      }}
      value={val}
      displayValue={descOfType(val)}
      items={AUTOCOMPLETE_OPTIONS}
      getItemValue={getItemValue}
      getItemId={getItemId}
      onChange={noop}
      onSelect={onSelect}
    />
  );
};

export default RightYAxisOption;
