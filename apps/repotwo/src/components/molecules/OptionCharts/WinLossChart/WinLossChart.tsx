import React, { useState } from "react";
import {
  Box,
  useColorModeValue,
  useBreakpointValue,
  Text,
  Stack,
} from "@chakra-ui/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  Label,
} from "recharts";
import CustomTooltip from "./Tooltip";
import { calculatePlotData } from "./calculatePlotData";
import PriceRangeSlider from "./Sliders/PriceRangeSlider";
import { type ChartStockData } from "src/components/Calculator/Results/Results";
import {
  type CalculatorOption,
  type Equity,
} from "@utils/calculateProfitEstimates/calculateProfitEstimates";
import DaySlider from "./Sliders/DaySlider";
import { map } from "lodash";

type Props = {
  stockData: ChartStockData;
  daysToProfitCalculation: number;
  setDaysToProfitCalculation: React.Dispatch<React.SetStateAction<number>>;
  breakEvens: number[];
  calculatorOptions: CalculatorOption[];
  equity: Equity;
};

const WinLossChart: React.FC<Props> = ({
  stockData,
  daysToProfitCalculation,
  setDaysToProfitCalculation,
  breakEvens,
  calculatorOptions,
  equity,
}) => {
  const [xAxisPercent, setXAxisPercent] = useState(10);

  const { data, labels, gradientOffset, referencePrices } = calculatePlotData({
    currentStockPrice: stockData.price,
    calculatorOptions,
    equity,
    daysToProfitCalculation,
    dividend: stockData.divYield / 100,
    xAxisPercent,
    breakEvens,
  });

  const isSmBreakpoint = useBreakpointValue({
    base: true,
    sm: false,
  });

  const background = useColorModeValue("background.50", "cards.800");
  const toolTipColor = useColorModeValue("black", "white");
  return (
    <Box
      h="600px"
      w="100%"
      minHeight="500px"
      bg={background}
      px={{ base: 0, sm: 5 }}
      pb={5}
    >
      {isSmBreakpoint && <Text color="#9A93B4">{labels.y}</Text>}
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart width={500} height={400} data={data}>
          <defs>
            <linearGradient id="fillColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={0} stopColor="#00CC08" />
              <stop
                offset={gradientOffset}
                stopColor="#00CC08"
                stopOpacity={0}
              />
              <stop
                offset={gradientOffset}
                stopColor="#FF4444"
                stopOpacity={0}
              />
              <stop offset={100} stopColor="#FF4444" />
            </linearGradient>
            <linearGradient id="strokeColor" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset={gradientOffset}
                stopColor="#00CC08"
                stopOpacity={1}
              />
              <stop
                offset={gradientOffset}
                stopColor="#FF4444"
                stopOpacity={1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="y"
            stroke="url(#strokeColor)"
            strokeWidth={5}
            fill="url(#fillColor)"
          />
          <CartesianGrid
            stroke="#9A93B4"
            strokeDasharray="1"
            opacity={0.4}
            vertical={false}
          />
          <ReferenceLine y={0} stroke="#9A93B4" />
          <XAxis
            stroke="#9A93B4"
            dataKey="x"
            tickFormatter={(value) => `$${value}`}
            allowDecimals={false}
            type="number"
            domain={["dataMin", "dataMax"]}
          >
            <Label
              value={labels.x}
              fill="#9A93B4"
              offset={-4}
              position="insideBottom"
            />
          </XAxis>
          <YAxis
            stroke="#9A93B4"
            dataKey="y"
            tickFormatter={(value) => `$${value}`}
            mirror={isSmBreakpoint}
          >
            {!isSmBreakpoint && (
              <Label
                value={labels.y}
                fill="#9A93B4"
                angle={-90}
                position={isSmBreakpoint ? "insideTop" : "insideLeft"}
                dy={100}
                dx={isSmBreakpoint ? 20 : 0}
              />
            )}
          </YAxis>
          <Tooltip
            cursor={{ stroke: toolTipColor, strokeWidth: 1 }}
            content={CustomTooltip}
          />
          {referencePrices?.map((referencePrice, index) => (
            <ReferenceLine key={index} x={referencePrice.price}>
              <Label
                value={referencePrice.label}
                angle={-90}
                dy={index % 2 ? -100 : 100}
                dx={isSmBreakpoint ? 20 : 0}
              />
            </ReferenceLine>
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <Stack gap="3">
        <PriceRangeSlider
          xAxisPercent={xAxisPercent}
          setXAxisPercent={setXAxisPercent}
        />
        <DaySlider
          daysToProfitCalculation={daysToProfitCalculation}
          setDaysToProfitCalculation={setDaysToProfitCalculation}
          maxDays={Math.min(
            ...map(calculatorOptions, (contract) => contract.daysToExpiration)
          )}
        />
      </Stack>
    </Box>
  );
};

export default WinLossChart;
