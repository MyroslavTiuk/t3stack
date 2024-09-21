import React from "react";

import { type CompWithClassName } from "opc-types/lib/util/CompWithClassName";
import { type CompWithChildren } from "opc-types/lib/util/CompWithChildren";

import Box from "../Box";

import combineClassNames from "../../../../utils/Html/combineClassNames";
import forceArray from "../../../../utils/Data/forceArray/forceArray";

interface Props extends CompWithClassName, CompWithChildren {
  cols: number | number[];
}

const GridItem = (props: Props) => {
  const cols = forceArray(props.cols);
  const classNames = combineClassNames(
    [
      cols.length === 0
        ? "_cols-12"
        : cols.length === 1
        ? `_cols-${cols[0]}`
        : cols.length === 2
        ? `_cols-${cols[0]} _cols-tab-plus-${cols[1]}`
        : cols.length === 3
        ? `_cols-${cols[0]} _cols-tab-${cols[1]} _cols-dsk-plus-${cols[2]}`
        : "",
    ],
    props.className
  );
  return <Box className={classNames}>{props.children}</Box>;
};

export default GridItem;
