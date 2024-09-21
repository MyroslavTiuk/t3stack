import { type FC } from "react";
import React from "react";

import Box from "../Box";
import T from "../Typo";

import css from "./RadioLabel.module.scss";
import { type BoxProps } from "../Box/Box.props";

interface RadioLabelProps extends BoxProps {
  onClick: () => void;
  checked: boolean;
  label: string | React.ReactNode;
  padForMenuList?: boolean;
}

const RadioLabel: FC<RadioLabelProps> = ({
  onClick,
  checked,
  label,
  padForMenuList,
  ...boxProps
}: RadioLabelProps): ReturnType<typeof Box> => {
  return (
    <Box
      className={css.clickable}
      tagName="label"
      flexSec="center"
      pv={padForMenuList ? 1 / 2 : undefined}
      ph={padForMenuList ? 1 / 3 : undefined}
      {...boxProps}
    >
      <input type="radio" onChange={onClick} checked={checked} />
      &nbsp;
      <T tagName="span" content-pragmatic>
        {label}
      </T>
    </Box>
  );
};

export default RadioLabel;
