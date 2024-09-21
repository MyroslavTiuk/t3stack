import React, { type FC } from "react";

import { type ObjRecord } from "opc-types/lib/util/ObjRecord";

import Box from "../Box";
import T from "../Typo";

import css from "./ToggleButtonPair.module.scss";
import orUndef from "../../../../utils/Data/orUndef/orUndef";

interface ToggleButtonPairProps {
  value: string | null | undefined;
  setValue: (val: string) => void;
  options: ObjRecord<string>;
  disabled?: boolean;
}

const useToggleButtonPair = (props: ToggleButtonPairProps) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (it's right, but I check)
  const pair: [[string, string | undefined], [string, string | undefined]] =
    React.useMemo(() => Object.entries(props.options), [props.options]);
  if (pair.length > 2) {
    throw Error("ToggleButtonPair received options with more than two entries");
  }
  return {
    pair,
  };
};
const ToggleButtonPair: FC<ToggleButtonPairProps> = (
  props: ToggleButtonPairProps
): ReturnType<typeof Box> => {
  const { pair } = useToggleButtonPair(props);

  const toggleSwitch1 = React.useCallback(
    () => props.setValue(pair[0][0]),
    [props.setValue, pair]
  );
  const toggleSwitch2 = React.useCallback(
    () => props.setValue(pair[1][0]),
    [props.setValue, pair]
  );

  return (
    <Box className={css.container}>
      <T
        tagName="span"
        content-pragmatic
        anemic
        className={[
          css._item,
          props.disabled && css["--disabled"],
          props.value === pair[0][0] && css["--selected"],
          !props.value && css["--no-value-selected"],
        ]}
        onClick={orUndef(!props.disabled && toggleSwitch1)}
      >
        {pair[0][1]}
      </T>
      <T
        tagName="span"
        content-pragmatic
        anemic
        className={[
          css._item,
          props.disabled && css["--disabled"],
          props.value === pair[1][0] && css["--selected"],
          !props.value && css["--no-value-selected"],
        ]}
        onClick={orUndef(!props.disabled && toggleSwitch2)}
      >
        {pair[1][1]}
      </T>
    </Box>
  );
};

export default ToggleButtonPair;
