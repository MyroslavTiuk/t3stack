import { Box, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type OptionWithHistory } from "src/server/router/backtester";
import CustomTooltip from "./Tooltip";
import { format, isBefore } from "date-fns";

function calculateCoveredCallWin(option: OptionWithHistory, date: Date) {
  const priceOnDate = option.history.find((price) => price.date === date);
  if (!priceOnDate) {
    return 0;
  }
  const winWithStock = priceOnDate.underlying_price - option.underlying_last;
  const lossWithOption = priceOnDate.bid_price - option.c_ask;
  return winWithStock - lossWithOption;
}

const Plot: React.FC<{ option: OptionWithHistory }> = ({ option }) => {
  const isSmBreakpoint = useBreakpointValue({
    base: true,
    sm: false,
  });
  const toolTipColor = useColorModeValue("black", "white");
  const background = useColorModeValue("background.50", "cards.800");

  const futureHistory = option.history.filter((price) =>
    isBefore(new Date(option.quote_date), new Date(price.date))
  );
  const plotData = futureHistory.map((price) => ({
    x: price.date,
    y: calculateCoveredCallWin(option, price.date),
  }));

  const gradientOffset = (() => {
    const maxY = Math.max(...plotData.map((i) => i.y));
    const minY = Math.min(...plotData.map((i) => i.y));
    if (maxY <= 0) {
      return 0;
    }
    if (minY >= 0) {
      return 1;
    }

    return maxY / (maxY - minY);
  })();

  if (plotData.length <= 1) {
    return null;
  }

  return (
    <Box
      h="300px"
      w="100%"
      minHeight="300px"
      bg={background}
      px={{ base: 0, sm: 5 }}
      pb={5}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart width={500} height={400} data={plotData}>
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
            tickFormatter={(value) => format(new Date(value), "MMM d")}
          >
            <Label
              value={"Date"}
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
                value={"Win/Loss"}
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
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Plot;
