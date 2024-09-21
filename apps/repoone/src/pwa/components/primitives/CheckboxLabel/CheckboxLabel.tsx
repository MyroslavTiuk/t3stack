import { type FC } from "react";
import React from "react";

import Box from "../Box";
import T from "../Typo";

import css from "./CheckboxLabel.module.scss";
import { type BoxProps } from "../Box/Box.props";

interface CheckboxLabelProps extends BoxProps {
  onClick: () => void;
  checked: boolean;
  label: string | React.ReactNode;
  padForMenuList?: boolean;
}

const CheckboxLabel: FC<CheckboxLabelProps> = ({
  onClick,
  checked,
  label,
  padForMenuList,
  ...boxProps
}: CheckboxLabelProps): ReturnType<typeof Box> => {
  return (
    <Box
      className={css.clickable}
      tagName="label"
      flexSec="center"
      pv={padForMenuList ? 1 / 2 : undefined}
      ph={padForMenuList ? 1 / 3 : undefined}
      {...boxProps}
    >
      <input type="checkbox" onClick={onClick} checked={checked} />
      &nbsp;
      <T tagName="span" content-pragmatic>
        {label}
      </T>
    </Box>
  );
};

export default CheckboxLabel;
