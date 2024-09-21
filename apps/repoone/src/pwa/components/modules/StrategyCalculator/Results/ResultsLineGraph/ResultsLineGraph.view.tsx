/* eslint-disable react/display-name */
import { type StrategyComplete } from "opc-types/lib/Strategy";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import { type Nullable } from "errable";
import React, { useContext } from "react";

import { type DisplayValueTypes } from "opc-types/lib/DisplayValueTypes";

import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type Tuple } from "opc-types/lib/Tuple";
import LineChart from "../../../../charts/LineChart.view";
import selectUnderlyingLeg from "../../../../../store/selectors/currentCalculation/selectUnderlyingLeg";
import formatPrice from "../../../../../../utils/String/formatPrice/formatPrice";
import { type ReferenceLineData } from "../../../../charts/LineChart.types";
import formatPercent from "../../../../../../utils/String/formatPercent/formatPercent";
import nbsp from "../../../../../../utils/Html/nbsp";
import Box from "../../../../primitives/Box";
import T from "../../../../primitives/Typo";

import { getScale } from "../ResultsMatrix/ResultsMatrix.view";
import estimatesToLineChartData from "./estimatesToLineChartData";
import css from "./ResultsLineGraph.module.scss";
import { LAYOUT_OPTIONS } from "../../../../../../../opc-types/lib/LAYOUT_OPTIONS";
import { NewSavedCalcsContext } from "~/pwa/components/modules/StrategyCalculator/NewSavedCalculations/NewSavedCalculationsContext";

export interface Props {
  estimate: StrategyEstimate;
  currentCalc: StrategyComplete;
  legendStacked?: boolean;
  stockComparisonPoints: Nullable<ObjRecord<number>>;
}

const DisplayTypeUnitValues: Record<DisplayValueTypes, string> = {
  ROI_MAX_RISK: "PERCENTAGE",
  ROI_COLLATERAL: "PERCENTAGE",
  PERC_MAX_RETURN: "PERCENTAGE",
  STRATEGY_VALUE: "CURRENCY",
  PL_DOLLARS: "CURRENCY",
};

export default function ResultsLineGraph({
  estimate,
  currentCalc,
  legendStacked,
  stockComparisonPoints,
}: Props) {
  const displayValueType = currentCalc?.displayValueType || "ROI_MAX_RISK";
  const strategyScale = getScale(currentCalc);
  const currentPrice = selectUnderlyingLeg(currentCalc)?.curPriceLast || null;
  const isPercentageUnit =
    DisplayTypeUnitValues[displayValueType] === "PERCENTAGE";

  const lineChartData = estimatesToLineChartData({
    estimate,
    displayValueType,
    strategyScale,
    isPercentageUnit,
    stockComparisonPoints,
  });

  const userViewSettingsContext = useContext(NewSavedCalcsContext);

  function ReferenceLabel({
    label,
    viewBox,
    dy,
    dx,
    position,
  }: {
    label: string;
    viewBox?: any;
    dy?: number;
    dx?: number;
    position: "top" | "bottom";
  }) {
    const x = viewBox?.width + viewBox?.x - 20;

    const y = position === "top" ? viewBox?.y - 17 : viewBox?.height + 22;
    const bgColor = "#91a6bc";
    return (
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter x="0" y="0" width="1" height="1" id="solid">
            <feFlood floodColor={bgColor} />
            <feComposite in="SourceGraphic" operator="and" />
          </filter>
        </defs>
        <g>
          <text
            x={x + 80 / 2}
            y={y + 20 / 2}
            filter="url(#solid)"
            dy={dy}
            dx={dx}
            fill={bgColor}
            fontSize={16}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {label}
          </text>
          <text
            x={x + 80 / 2}
            y={y + 20 / 2}
            dy={dy}
            dx={dx}
            fill={"#FFF"}
            fontSize={14.5}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {nbsp}
            {label}
            {nbsp}
          </text>
        </g>
      </svg>
    );
  }

  const breakEvenReferenceLines = estimate?.summary?.breakevens?.map(
    (item) => ({
      xValue: item[0],
      label: () => (
        <ReferenceLabel position="top" label={`B/E ${formatPrice(item[0])}`} />
      ),
      dotted: true,
    })
  );

  const referenceLines: ReferenceLineData[] = [
    {
      yValue: 0,
      label: () => "",
    },
    ...breakEvenReferenceLines,
  ];

  const calcSymb = selectUnderlyingLeg(currentCalc)?.val?.toUpperCase() || "";
  if (currentPrice) {
    referenceLines.push({
      xValue: currentPrice,
      label: () => (
        <ReferenceLabel
          position="bottom"
          label={`${formatPrice(currentPrice)} (last)`}
        />
      ),
    });
  }

  const formatVal = isPercentageUnit
    ? (v: number) => formatPercent(v / 100)
    : (v: number) => formatPrice(v, { hideMinus: false });

  const yAxisWidth = React.useMemo(() => {
    const yDomain = lineChartData.dataSet.reduce(
      (minMax, daySet) => {
        const dayData = Object.entries(daySet)
          .filter(([key]) => key !== "xValue")
          .map(([_, value]) => value);
        const dayMinMax = [Math.min(...dayData), Math.max(...dayData)];
        return [
          minMax[0] === null || dayMinMax[0] < minMax[0]
            ? dayMinMax[0]
            : minMax[0],
          minMax[1] === null || dayMinMax[1] > minMax[1]
            ? dayMinMax[1]
            : minMax[1],
        ] as [number, number];
      },
      [null, null] as [Nullable<number>, Nullable<number>]
    ) as [number, number];
    const yDomainLabels = [formatVal(yDomain[0]), formatVal(yDomain[1])];
    const maxWidth = Math.max(yDomainLabels[0].length, yDomainLabels[1].length);
    return 10 + maxWidth * 8;
  }, [lineChartData, formatVal]);
  const xDomain = [
    lineChartData?.dataSet[0]?.xValue,
    lineChartData?.dataSet[lineChartData.dataSet.length - 1]?.xValue,
  ] as Tuple<number>;

  return (
    <Box
      className={[
        css.resultsLineChart,
        legendStacked && css["--legendStacked"],
        `w-fit ${
          userViewSettingsContext.calculatorUserViewSettings.screenLayout ==
          LAYOUT_OPTIONS.STACKED
            ? "md:w-[650px]"
            : "md:w-[500px]"
        }`,
      ]}
    >
      <LineChart
        legendStacked={legendStacked}
        dataSet={lineChartData.dataSet}
        legends={lineChartData.legends}
        toolTipProps={{
          labelFormatter: (label) => {
            const floatValue = parseFloat(`${label}`);
            return `${calcSymb} @ ${formatPrice(floatValue)}`;
          },
          formatter: (value) => {
            const floatValue = parseFloat(`${value}`);
            return formatVal(floatValue);
          },
        }}
        // toolTipSecondaryValues={lineChartData.toolTipSecondaryValues}
        referenceLines={referenceLines}
        xAxisProps={{
          tickCount: 8,
          domain: xDomain,
        }}
        yAxisProps={{
          tickFormatter: formatVal,
          axisLine: true,
          tickCount: 8,
          width: yAxisWidth,
        }}
        renderCustomLegends={(legends) => {
          return (
            <Box
              className={[
                css.legendContainer,
                legendStacked && css["--legendStacked"],
                "w-full justify-between",
              ]}
              flex
              flex-wrap={legendStacked}
            >
              {legends.map((item) => {
                return (
                  <Box
                    className={[
                      css.legendItem,
                      userViewSettingsContext.calculatorUserViewSettings
                        .screenLayout == LAYOUT_OPTIONS.STACKED
                        ? ""
                        : "-translate-x-12",
                    ]}
                    flex
                    key={item.label}
                    flexSec="center"
                  >
                    <Box
                      className={[css._vis, item.dotted && css["--dotted"]]}
                      style={{ color: item.color }}
                      mr={1 / 3}
                    />
                    <T content-pragmatic mr={1}>
                      {item.label}
                    </T>
                  </Box>
                );
              })}
            </Box>
          );
        }}
      />
    </Box>
  );
}
