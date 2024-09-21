import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  XAxis,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import TooltipContainer from "./tooltipContainer";

import ChartContainer from "./chartContainer";
import { CHART_COLORS } from "./chartColors";
import { largeNumbersFormatter } from "~/utils/format";

const BarChart: React.FC<Props> = ({ title, description, isLoading, data }) => {
  return (
    <ChartContainer
      title={title}
      description={description}
      isLoading={isLoading}
      isEmpty={data.length === 0}
    >
      <ResponsiveContainer>
        <RechartsBarChart
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
            domain={["dataMin - 100", "dataMax + 100"]}
            tickFormatter={largeNumbersFormatter}
          />
          <Tooltip content={ChartTooltip} />
          <Bar dataKey="value" barSize={12}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value > 0 ? CHART_COLORS.blue : CHART_COLORS.orange}
              />
            ))}
          </Bar>
        </RechartsBarChart>
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

export default BarChart;
