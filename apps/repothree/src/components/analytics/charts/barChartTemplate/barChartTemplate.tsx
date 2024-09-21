import React from "react";
import {
  BarChart,
  Bar,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  XAxis,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import TooltipContainer from "../tooltipContainer";

import ChartContainer from "../chartContainer";
import { CHART_COLORS } from "../chartColors";
import { largeNumbersFormatter } from "~/utils/format";

export const BarChartTemplate: React.FC<Props> = ({
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
          data={data}
          margin={{
            top: 20,
            right: 30,
            bottom: 60,
          }}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
          <YAxis
            tickFormatter={largeNumbersFormatter}
            domain={["dataMin - 100", "dataMax + 100"]}
          />
          <Tooltip content={ChartTooltip} />
          <Bar dataKey="value" barSize={12}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value > 0 ? CHART_COLORS.green : CHART_COLORS.red}
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
        {payload[0].payload.name}: {payload[0].value?.toFixed(2)}
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
