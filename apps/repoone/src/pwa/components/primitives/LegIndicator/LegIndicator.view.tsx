import { type FC } from "react";
import React from "react";

import { type CompWithClassName } from "opc-types/lib/util/CompWithClassName";
import { type Optional } from "opc-types/lib/util/Optional";
import Box from "../Box";

import css from "./LegIndicator.module.scss";
import combineClassNames from "../../../../utils/Html/combineClassNames";

interface LegIndicatorProps extends CompWithClassName {
  opType?: "call" | "put" | "both" | null;
  act?: "buy" | "sell" | "both" | null;
  "vertically-center"?: boolean;
  pointLeft?: boolean;
  letter?: string;
}

const LegIndicator: FC<LegIndicatorProps> = (
  props: LegIndicatorProps
): ReturnType<typeof Box> => {
  const alphabeticLegIndicators = ["A", "B", "C", "D", "E"];
  /////////////
  const indicatorsDistributor = () => {
    let i = 0;
    return () => {
      i += 1;
      return alphabeticLegIndicators[i - 1];
    };
  };
  const className = combineClassNames(
    [
      css.legIndicator,
      props.act === "buy" && css["--act-buy"],
      props.act === "sell" && css["--act-sell"],
      props.act === "both" && css["--act-both"],
      props.pointLeft && css["--dir-left"],
      props["vertically-center"] && css["--vertically-center"],
    ] as Optional<string | false>[],
    props.className
  );
  return (
    <Box className={className} inline-block>
      <span
        className={css._text}
        //////////////// Pointer on strike
      >
        {props.letter
          ? props.letter
          : props.opType === "call"
          ? indicatorsDistributor()()
          : props.opType === "put"
          ? "P"
          : "*"}
      </span>
    </Box>
  );
};

export default LegIndicator;
