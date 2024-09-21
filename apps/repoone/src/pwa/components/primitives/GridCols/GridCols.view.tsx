import { type FC } from "react";
import React from "react";

import Box from "../Box";
// import T from '../../primitives/Typo';

import { type GridColsProps } from "./GridCols.props";
import forceArray from "../../../../utils/Data/forceArray/forceArray";

// import css from './GridCols.scss';

const GridCols: FC<GridColsProps> = (
  props: GridColsProps
): ReturnType<typeof Box> => {
  return (
    <Box
      className={[
        "grid",
        props["dont-hide-content"] && "dont-hide-content",
        ...((props.className && forceArray(props.className)) || []),
      ]}
    >
      <div className="_inner">{props.children}</div>
    </Box>
  );
};

export default GridCols;
