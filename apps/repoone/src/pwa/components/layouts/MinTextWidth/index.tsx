import { type FC } from "react";
import React from "react";

import Box from "../../primitives/Box";

import css from "./MinTextWidth.module.scss";

type MinTextWidthProps = {
  children: {
    show: React.ReactNode;
    hide: React.ReactNode;
  };
};

const MinTextWidth: FC<MinTextWidthProps> = (
  props: MinTextWidthProps
): ReturnType<typeof Box> => {
  return (
    <Box className={css.main}>
      <Box className={[css._ele, css["--show"]]}>{props.children.show}</Box>
      <Box className={[css._ele, css["--hide"]]} aria-hidden>
        {props.children.hide}
      </Box>
    </Box>
  );
};

export default MinTextWidth;
