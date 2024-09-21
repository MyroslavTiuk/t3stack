import React from "react";
import {
  BarChart,
  Bar,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import TooltipContainer from "./tooltipContainer";

import ChartContainer from "./chartContainer";
import { CHART_COLORS } from "./chartColors";
import { largeNumbersFormatter } from "~/utils/format";

const HorizontalBarChart: React.FC<Props> = ({
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
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 20,
            right: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={largeNumbersFormatter} />
          <YAxis type="category" dataKey="name" />
          <Tooltip content={ChartTooltip} />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value > 0 ? CHART_COLORS.blue : CHART_COLORS.orange}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const ChartTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        {payload[0].payload.name}: {payload[0].value?.toLocaleString()}
      </TooltipContainer>
    );
  }

  return null;
};

type Props = {
  title: string;
  description: string;
  isLoading: boolean;
  data: { name: string; value: number }[];
};

export default HorizontalBarChart;
