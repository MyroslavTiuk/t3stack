import { type FC } from "react";
import React from "react";

import Box from "../Box";

import css from "./SwitchToggle.module.scss";

type SwitchToggleProps = {
  state: boolean;
  onChange: (newValue: boolean) => void;
};

const SwitchToggle: FC<SwitchToggleProps> = (
  props: SwitchToggleProps
): ReturnType<typeof Box> => {
  return (
    <Box
      onClick={() => props.onChange(!props.state)}
      inline-block
      className={[css.switchCtnr, props.state && css["--is-enabled"]]}
    >
      <Box className={css._toggle}>{null}</Box>
    </Box>
  );
};

export default React.memo(SwitchToggle);
