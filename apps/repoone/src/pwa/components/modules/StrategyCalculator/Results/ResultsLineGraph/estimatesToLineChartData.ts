/* eslint-disable prefer-destructuring */
import moment from "moment-timezone";
import { type DisplayValueTypes } from "opc-types/lib/DisplayValueTypes";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import * as R from "ramda";

import {
  type LegendData,
  type LineChartData as DataSet,
} from "../../../../charts/LineChart.types";
import calcDisplayVal from "../ResultsMatrix/helpers/calcDisplayVals";
import { type PositionEstimate } from "opc-types/lib/PositionEstimate";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type Nullable } from "opc-types/lib/util/Nullable";

export interface LineChartData {
  dataSet: DataSet[];
  legends: LegendData[];
  // toolTipSecondaryValues: any;
}

const getMomentDateForLegendKey = (dateString: string) => {
  const year = dateString.substr(0, 4);
  const month = dateString.substr(4, 2);
  const day = dateString.substr(6, 2);
  const hour = dateString.substr(9, 2);
  const min = dateString.substr(11, 2);
  const newDate = moment.tz(
    `${year}-${month}-${day} ${hour}:${min}`,
    "America/New_York"
  );

  return newDate;
};

interface LineData {
  unixDate: number;
  newLabel: string;
  oldLabel: string;
}

const getFilteredLines = (
  theoPointsValues: Record<string, PositionEstimate>
): LineData[] => {
  const theoPointsValuesKeys = Object.keys(theoPointsValues);
  const lineValueKeys = theoPointsValuesKeys.map((item) => {
    const newDate = getMomentDateForLegendKey(item);
    const isToday = moment.tz("America/New_York").isSame(newDate, "d");

    const newLabel = isToday ? "Today" : newDate.format("Do MMM YYYY");

    return {
      unixDate: newDate.unix(),
      newLabel,
      oldLabel: item,
    };
  });

  const sortByUnixDate = R.sortBy(R.prop("unixDate"));
  const sortedLineValueKeys = sortByUnixDate(lineValueKeys);

  const keysLength = sortedLineValueKeys.length;
  const filteredLines =
    keysLength > 5
      ? [
          sortedLineValueKeys[0],
          sortedLineValueKeys[Math.ceil((keysLength / 5) * 2) - 1],
          sortedLineValueKeys[Math.ceil((keysLength / 5) * 3) - 1],
          sortedLineValueKeys[Math.ceil((keysLength / 5) * 4) - 1],
          sortedLineValueKeys[keysLength - 1],
        ]
      : sortedLineValueKeys;
  filteredLines[filteredLines.length - 1].newLabel = "Expiry";
  return filteredLines;
};

const legendColors = ["#478AEF", "#8AA6D1", "#16BDC8", "#4D969A", "#181818"];

interface Params {
  estimate: StrategyEstimate;
  displayValueType: DisplayValueTypes;
  strategyScale: number;
  isPercentageUnit?: boolean;
  stockComparisonPoints: Nullable<ObjRecord<number>>;
}

const VS_STOCK_LABEL = "vs Hold Stock";

export default function estimatesToLineChartData({
  estimate,
  displayValueType = "ROI_MAX_RISK",
  strategyScale,
  // isPercentageUnit,
  stockComparisonPoints,
}: Params): LineChartData {
  const { theoPoints } = estimate;
  const theoPointsKeys = Object.keys(theoPoints);
  // const toolTipSecondaryValues = {};

  const legends: LegendData[] = [];
  const shouldShowStockComparisonLine =
    stockComparisonPoints && displayValueType !== "STRATEGY_VALUE";
  const dataSet = theoPointsKeys.reduce((allData, currentValue: string) => {
    const otherDataValues: ObjRecord<number> = {};

    const validLineValues: LineData[] = getFilteredLines(
      theoPoints[currentValue]
    );

    validLineValues.forEach((lineData: LineData, i) => {
      const lineValueItems: PositionEstimate =
        theoPoints[currentValue][lineData.oldLabel];

      const isLast = i === validLineValues.length - 1;

      const legendsFound = legends.find(
        (item) => item.label === lineData.newLabel
      );

      if (!legendsFound) {
        legends.push({
          label: lineData.newLabel,
          color: isLast
            ? legendColors[legendColors.length - 1]
            : legendColors[i],
          thicc: i === 0 || isLast,
        });
      }
      const displayVal = calcDisplayVal[displayValueType](
        estimate.initial,
        lineValueItems.gross,
        estimate.summary,
        strategyScale
      );

      const formattedDisplayValue = displayVal[0];
      otherDataValues[lineData.newLabel] = formattedDisplayValue;

      // toolTipSecondaryValues[
      //   `${parseFloat(currentValue)}_${formattedDisplayValue}`
      // ] = displayVal[1];
    });
    if (shouldShowStockComparisonLine && stockComparisonPoints) {
      const n = stockComparisonPoints[currentValue];
      if (n) {
        otherDataValues[VS_STOCK_LABEL] = calcDisplayVal[displayValueType](
          estimate.initial,
          n,
          estimate.summary
        )[0];
      }
    }

    allData.push({
      xValue: parseFloat(currentValue),
      ...otherDataValues,
    });
    return allData;
  }, [] as DataSet[]);

  if (shouldShowStockComparisonLine) {
    legends.push({
      label: VS_STOCK_LABEL,
      color: "#B78A8A",
      dotted: true,
    });
  }

  const sortByXValue = R.sortBy(R.prop("xValue"));

  return {
    dataSet: sortByXValue(dataSet),
    legends: R.uniq(legends),
    // toolTipSecondaryValues,
  };
}
