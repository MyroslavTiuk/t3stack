import { isNull } from "errable";

import { type PositionEstimateInitial } from "opc-types/lib/PositionEstimate";
import { type StrategyEstimateSummary } from "opc-types/lib/StrategyEstimateSummary";
import { type DisplayValueTypes } from "opc-types/lib/DisplayValueTypes";

import DISPLAY_VALUE_TYPES from "../../../../../../../consts/DISPLAY_VALUE_TYPES";
import CentsMath from "../../../../../../../utils/CentsMath/CentsMath";
import isInfinite from "../../../../../../../utils/Data/isInfinite";

export type DispTuple = [
  number, // Net value, as per displayValueType
  number // -1 to +positive where 1 = 100%
];

const PLDollars = (
  initPos: PositionEstimateInitial,
  gross: number,
  summary: StrategyEstimateSummary,
  _?: number
) => {
  const net = CentsMath.add(initPos.gross, gross);
  // @ts-ignore
  const flipNet = summary.maxRisk >= 0 ? -net : net;
  return [
    net,
    !isInfinite(summary.maxRisk)
      ? flipNet / -summary.maxRisk
      : !isInfinite(summary.maxReturn)
      ? flipNet / summary.maxReturn
      : summary.maxRisk1SD !== null
      ? flipNet / summary.maxRisk1SD
      : summary.maxRisk2SD !== null
      ? flipNet / summary.maxRisk2SD
      : null,
  ] as DispTuple;
};

const ROIMaxRisk = (
  initPos: PositionEstimateInitial,
  gross: number,
  summary: StrategyEstimateSummary,
  _?: number
): DispTuple => {
  const net = CentsMath.add(initPos.gross, gross);
  if (isInfinite(summary.maxRisk))
    return ROICollateral(initPos, gross, summary, _);
  const roi = 100 * (net / -summary.maxRisk);
  const flipNegMulti = summary.maxRisk >= 0 ? -1 : 1;
  return [
    flipNegMulti * roi,
    (flipNegMulti * net) / -summary.maxRisk,
  ] as DispTuple;
};

const ROICollateral = (
  initPos: PositionEstimateInitial,
  gross: number,
  summary: StrategyEstimateSummary,
  _?: number
): DispTuple => {
  const net = CentsMath.add(initPos.gross, gross);
  if (isNull(summary.collateral)) return PLDollars(initPos, gross, summary, _);
  const roi = 100 * (net / -summary.collateral);
  // const flipNegMulti = summary.collateral === 0 ? -1 : 1;
  return [roi, net / -summary.collateral] as DispTuple;
};

const ROIMaxReturn = (
  initPos: PositionEstimateInitial,
  gross: number,
  summary: StrategyEstimateSummary,
  _?: number
): DispTuple => {
  const net = CentsMath.add(initPos.gross, gross);
  if (isInfinite(summary.maxReturn))
    return PLDollars(initPos, gross, summary, _);
  const roi = 100 * (net / summary.maxReturn);
  const flipNegMulti = summary.maxReturn < 0 ? -1 : 1;
  return [roi, (flipNegMulti * net) / summary.maxReturn] as DispTuple;
};

const StrategyValue = (
  initPos: PositionEstimateInitial,
  gross: number,
  summary: StrategyEstimateSummary,
  stratScale?: number
): DispTuple => {
  // @ts-ignore
  const val = CentsMath.div(gross, stratScale || 0);
  // @ts-ignore
  const flipNegMulti = summary.maxRisk >= 0 ? -1 : 1;
  return [
    val,
    (flipNegMulti * CentsMath.add(initPos.gross, gross)) /
      (!isInfinite(summary.maxRisk)
        ? -summary.maxRisk
        : !isInfinite(summary.maxReturn)
        ? summary.maxReturn
        : summary.maxRisk1SD !== null
        ? summary.maxRisk1SD
        : summary.maxRisk2SD !== null
        ? summary.maxRisk2SD
        : 100),
  ] as DispTuple;
};

const calcDisplayVal: Record<DisplayValueTypes, typeof PLDollars> = {
  [DISPLAY_VALUE_TYPES.PL_DOLLARS]: PLDollars,
  [DISPLAY_VALUE_TYPES.ROI_MAX_RISK]: ROIMaxRisk,
  [DISPLAY_VALUE_TYPES.PERC_MAX_RETURN]: ROIMaxReturn,
  [DISPLAY_VALUE_TYPES.STRATEGY_VALUE]: StrategyValue,
  [DISPLAY_VALUE_TYPES.ROI_COLLATERAL]: ROICollateral,
};

export default calcDisplayVal;
