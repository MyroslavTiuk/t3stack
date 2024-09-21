import { type FC, type ReactElement } from "react";
import React from "react";

import Box from "../../primitives/Box";

import { type StorybookCtnrProps } from "./StorybookCtnr.props";
import css from "./StorybookCtnr.module.scss";

const StorybookCtnrView: FC<StorybookCtnrProps> = (
  props: StorybookCtnrProps
): ReactElement<"div"> => {
  return (
    <Box className={[css.main, props.className || ""]}>{props.children}</Box>
  );
};

export default StorybookCtnrView;
