import React from "react";

import {
  type PositionEstimate,
  type PositionEstimateInitial,
} from "opc-types/lib/PositionEstimate";
import { type DisplayValueTypes } from "opc-types/lib/DisplayValueTypes";
import { type StrategyEstimateSummary } from "opc-types/lib/StrategyEstimateSummary";
import { type PositionPair } from "opc-types/lib/PositionPair";
import { type Rgb } from "opc-types/lib/Rgb";
import DISPLAY_VALUE_TYPES from "../../../../../../consts/DISPLAY_VALUE_TYPES";
import formatDisplayValue from "../../../../../../utils/String/formatDisplayValue/formatDisplayValue";
import formatPrice from "../../../../../../utils/String/formatPrice/formatPrice";
import CentsMath from "../../../../../../utils/CentsMath/CentsMath";
import isLast from "../../../../../../utils/Data/isLast/isLast";
import clx from "../../../../../../utils/Html/clx";
import T from "../../../../primitives/Typo";
import Box from "../../../../primitives/Box";
import Card from "../../../../primitives/Card";

import css from "./ResultsMatrix.module.scss";
import calcDisplayVals, { type DispTuple } from "./helpers/calcDisplayVals";
import { adjustNum } from "./helpers/adjustNum";

type Props = {
  theoValues: Record<string, PositionEstimate>;
  maxMinVisibleVals: [number, number];
  displayType: DisplayValueTypes;
  initPos: PositionEstimateInitial;
  summary: StrategyEstimateSummary;
  strategyScale: number;
  showPositionDetail: (pair: PositionPair) => void;
  strike: number;
  today: string;
};

// const CLASSIC_COLOR_SCHEME: [Rgb, Rgb, Rgb, Rgb] = [
//   { r: 255, g: 2, b: 0 },
//   { r: 255, g: 255, b: 255 },
//   { r: 117, g: 255, b: 0 },
//   { r: 0, g: 206, b: 0 },
// ];
// const CLASSY_COLOR_SCHEME: [Rgb, Rgb, Rgb, Rgb] = [
//   { r: 193, g: 31, b: 31 },
//   { r: 255, g: 255, b: 255 },
//   { r: 0, g: 195, b: 160 },
//   { r: 0, g: 195, b: 160 },
// ];
const SPRING_COLOR_SCHEME: [Rgb, Rgb, Rgb, Rgb] = [
  { r: 255, g: 31, b: 0 },
  { r: 255, g: 255, b: 255 },
  { r: 15, g: 255, b: 0 },
  { r: 0, g: 217, b: 90 },
];
const DEFAULT_COLOR_SCHEME = SPRING_COLOR_SCHEME;
const DEFAULT_MAX_LOSS = { r: 138, g: 22, b: 22 };

function mix(n1: number, n2: number, m: number) {
  return n1 * m + n2 * (1 - m);
}

function dispValStyle(
  num: number,
  limitRange: [number, number],
  cols: [Rgb, Rgb, Rgb, Rgb] = DEFAULT_COLOR_SCHEME
) {
  if (num === 0) return {};
  if (num === -1)
    return {
      backgroundColor: `rgba(${DEFAULT_MAX_LOSS.r}, ${DEFAULT_MAX_LOSS.g}, ${DEFAULT_MAX_LOSS.b}, 1)`,
      color: "rgba(255, 255, 255, 0.8)",
    };
  // number between -1 to 3
  const adjNum = adjustNum(num, limitRange);

  let m = 0;
  let palette1 = 0;
  let palette2 = 1;
  if (adjNum <= 0) {
    m = -adjNum;
  } else if (adjNum <= 1) {
    m = 1 - adjNum;
    palette1 = 1;
    palette2 = 2;
  } else {
    m = 2 - adjNum;
    palette1 = 2;
    palette2 = 3;
  }
  const col = {
    r: mix(cols[palette1].r, cols[palette2].r, m),
    g: mix(cols[palette1].g, cols[palette2].g, m),
    b: mix(cols[palette1].b, cols[palette2].b, m),
  };
  // const col = adjNum < 0 ? cols[0] : cols[1];
  // const a = Math.abs(Math.min(2, Math.max(-1, Math.round(adjNum * 10) / 10)));
  const a = 1;
  return {
    backgroundColor: `rgba(${col.r}, ${col.g}, ${col.b}, ${a})`,
  };
}

// const expMulti = 1.1;
// const adjustForExp = (cs: [Rgb, Rgb]) =>
//   [
//     { r: cs[0].r * expMulti, g: cs[0].g * expMulti, b: cs[0].b * expMulti },
//     { r: cs[1].r * expMulti, g: cs[1].g * expMulti, b: cs[1].b * expMulti },
//   ] as [Rgb, Rgb];

const detail = (
  theoValue: PositionEstimate,
  initPos: PositionEstimateInitial,
  dispVal: DispTuple
) => {
  return (
    <>
      <Box flex className={["--pri-space-between", css["hover-stat"]]}>
        <T className={css["_text"]} mr={1 / 3}>
          P/L:
        </T>
        <T className={css["_text"]}>
          {formatPrice(CentsMath.add(initPos.gross, theoValue.gross), {
            forceShowCents: true,
            hideMinus: false,
          })}
        </T>
      </Box>
      <Box flex className={["--pri-space-between", css["hover-stat"]]}>
        <T className={css["_text"]}>RoR:</T>
        <T className={css["_text"]}>
          {formatPrice(dispVal[0], {
            forceShowCents: true,
            hideDollar: true,
            hideMinus: false,
          })}
          %
        </T>
      </Box>
    </>
  );
};

export const ValueRowCols = (props: Props) => {
  const dayColScheme = DEFAULT_COLOR_SCHEME;
  const expColScheme = DEFAULT_COLOR_SCHEME; // adjustForExp(DEFAULT_COLOR_SCHEME);

  const theoEntries = Object.entries(props.theoValues);

  return (
    <>
      {theoEntries.map(([theoDate, theoValue], i) => {
        const hasPassed = props.today > theoDate;
        const lastCol = isLast(theoEntries, i);
        const displayVal = calcDisplayVals[props.displayType](
          props.initPos,
          theoValue.gross,
          props.summary,
          props.strategyScale
        );
        const displayValsROI = calcDisplayVals[
          DISPLAY_VALUE_TYPES.ROI_MAX_RISK
        ](props.initPos, theoValue.gross, props.summary, props.strategyScale);
        return (
          <td
            key={i}
            className={clx([
              css.cellTD,
              lastCol && css["--is-last"],
              hasPassed && !lastCol && css["--has-passed"],
            ])}
            onClick={() =>
              props.showPositionDetail({ date: theoDate, strike: props.strike })
            }
          >
            <T
              style={dispValStyle(
                displayVal[1],
                props.maxMinVisibleVals,
                lastCol ? expColScheme : dayColScheme
              )}
              content-detail-minor
              anemic
              className={[
                "flex",
                "--center",
                css["_display-text"],
                lastCol && css["_exp-txt"],
              ]}
            >
              {formatDisplayValue(displayVal[0])}
            </T>
            <Card className={css["_hover-detail"]} no-pad high-contrast>
              {detail(theoValue, props.initPos, displayValsROI)}
            </Card>
          </td>
        );
      })}
    </>
  );
};
