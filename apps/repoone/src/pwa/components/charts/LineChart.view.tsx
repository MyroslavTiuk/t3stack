import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  type TooltipProps,
  XAxis,
  type XAxisProps,
  YAxis,
  type YAxisProps,
} from "recharts";

import ContainerDimensions from "react-container-dimensions";

import Box from "../primitives/Box";

import css from "./LineChart.module.scss";
import {
  type LegendData,
  type LineChartData,
  type ReferenceLineData,
} from "./LineChart.types";

const X_AXIS_DATA_KEY = "xValue";
// <-- USED FOR CUSTOM TOOLTIP -->
// const CustomTooltip = (props) => {
//   if (props.active && props.showToolTip) {
//     console.log(props);
//     const { xValue, yValue } = props.tooltipValue;
//     return (
//       <Card className="custom-tooltip">
//         <Box>Fist Value: {yValue}</Box>
//         <Box>
//           Second Value: {props?.toolTipSecondaryValues?.[`${xValue}_${yValue}`]}
//         </Box>
//       </Card>
//     );
//   }

//   return null;
// };

interface LineChartProps {
  dataSet: LineChartData[];
  referenceLines?: ReferenceLineData[];
  // toolTipSecondaryValues: any;
  legends: LegendData[];
  legendStacked?: boolean;
  renderCustomLegends?: (legends: LegendData[]) => JSX.Element;
  xAxisProps?: XAxisProps;
  yAxisProps?: YAxisProps;
  toolTipProps?: TooltipProps<any, any>;
}

export default function LineChartView({
  dataSet,
  referenceLines,
  legends,
  legendStacked,
  renderCustomLegends,
  xAxisProps,
  yAxisProps,
  toolTipProps,
}: // toolTipSecondaryValues,
LineChartProps) {
  // <-- USED FOR CUSTOM TOOLTIP -->
  // const [showToolTip, setShowToolTip] = useState(false);
  // const [tooltipValue, setToolTipValue] = useState({
  //   xValue: 0,
  //   yValue: 0,
  // });
  return (
    <Box className={[css.container, legendStacked && css["--stacked"]]} flex>
      <Box className={css._chartContainer} flex>
        <ContainerDimensions>
          {({ width }) => (
            <LineChart
              width={width}
              height={500}
              data={dataSet}
              margin={{
                top: 20,
                right: 9,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="1 2" />
              <XAxis
                dataKey={X_AXIS_DATA_KEY}
                type="number"
                domain={["auto", "dataMax"]}
                allowDataOverflow
                {...xAxisProps}
              />
              <YAxis
                type="number"
                tick={{ fontSize: 15 }}
                domain={[
                  (dataMin: number) =>
                    dataMin < 0 ? dataMin * 1.05 : dataMin * 0.95,
                  (dataMax: number) =>
                    dataMax < 0 ? dataMax * 0.95 : dataMax * 1.05,
                ]}
                {...yAxisProps}
              />
              {/*  <-- USED FOR CUSTOM TOOLTIP -->
                content={
                  <CustomTooltip
                    showToolTip={showToolTip}
                    tooltipValue={tooltipValue}
                    toolTipSecondaryValues={toolTipSecondaryValues}
                  />
                }
                cursor={!showToolTip}
                wrapperStyle={!showToolTip ? { display: 'none' } : {}}
              /> */}
              <Tooltip {...toolTipProps} />
              {!renderCustomLegends && <Legend />}
              {referenceLines &&
                referenceLines?.map((item: ReferenceLineData) => (
                  <ReferenceLine
                    key={`${item.xValue}x${item.yValue}`}
                    x={item.xValue}
                    y={item.yValue}
                    stroke="#91A6BC"
                    label={item.label()}
                    strokeDasharray={item.dotted ? "4 4" : undefined}
                  />
                ))}

              {legends.map((item) => {
                return (
                  <Line
                    type="linear"
                    dataKey={item.label}
                    stroke={item.color}
                    strokeWidth={item.thicc ? 2 : 1}
                    strokeDasharray={item.dotted ? "2 2.67" : undefined}
                    key={item.label}
                    dot={false}
                    isAnimationActive={false}
                    // <-- USED FOR CUSTOM TOOLTIP -->
                    // activeDot={{
                    //   onMouseOver: (lineItem) => {
                    //     console.log({
                    //       xValue: lineItem?.payload?.xValue,
                    //       yValue: lineItem?.value,
                    //     });
                    //     setShowToolTip(true);
                    //     setToolTipValue({
                    //       xValue: lineItem?.payload?.xValue,
                    //       yValue: lineItem?.value,
                    //     });
                    //   },
                    //   onMouseLeave: () => setShowToolTip(false),
                    // }}
                  />
                );
              })}
            </LineChart>
          )}
        </ContainerDimensions>
      </Box>
      {renderCustomLegends && (
        <Box
          className={css._legendsContainer}
          flex-wrap
          mt={legendStacked ? 0 : 1}
        >
          {renderCustomLegends(legends)}
        </Box>
      )}
    </Box>
  );
}
