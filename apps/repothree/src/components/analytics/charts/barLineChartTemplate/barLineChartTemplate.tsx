import React from "react";

import {
  Bar,
  YAxis,
  XAxis,
  CartesianGrid,
  ComposedChart,
  Line,
  Tooltip,
  Cell,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { format } from "date-fns";
import TooltipContainer from "../tooltipContainer";

import ChartContainer from "../chartContainer";
import { CHART_COLORS } from "../chartColors";
import { largeNumbersFormatter } from "~/utils/format";

export const BarLineChartTemplate: React.FC<Props> = ({
  title,
  description,
  isLoading,
  data,
}) => {
  return (
    <ChartContainer
      title={title}
      description={description}
      isLoading={isLoading}
      isEmpty={data.length === 0}
    >
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            left: 5,
            bottom: 60,
            right: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" />
          <YAxis
            yAxisId="left"
            tickFormatter={largeNumbersFormatter}
            label={{ value: "Profit", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "# of Trades", angle: -90, dx: 20 }}
          />
          <Tooltip content={ChartTooltip} />
          <Bar dataKey="profit" barSize={20} name="Profit" yAxisId="left">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.profit > 0 ? CHART_COLORS.green : CHART_COLORS.red}
              />
            ))}
          </Bar>
          <Line
            dot={false}
            strokeWidth={2}
            dataKey="numberOfTrades"
            stroke={CHART_COLORS.black}
            name="Number of trades"
            yAxisId="right"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const ChartTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const [
      {
        value: profit,
        payload: { date },
      },
      { value: numberOfTrades },
    ] = payload;

    return (
      <TooltipContainer>
        <span>Profit: {profit}</span>
        <br />
        <span>Number of trades: {numberOfTrades}</span>
        <br />
        <span>Date: {format(new Date(date), "MMM yyyy")}</span>
      </TooltipContainer>
    );
  }

  return null;
};

type Props = {
  title: string;
  description: string;
  isLoading: boolean;
  data: { profit: number; numberOfTrades: number; date: string }[];
};
