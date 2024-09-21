import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import ChartContainer from "../chartContainer";
import { CHART_COLORS } from "../chartColors";
import { map } from "lodash";
import { largeNumbersFormatter } from "~/utils/format";

export const PieChartTemplate: React.FC<Props> = ({
  data,
  title,
  description,
  isLoading,
}) => {
  const total = useMemo(
    () => data.reduce((acc, item) => acc + item.value, 0),
    [data]
  );
  return (
    <ChartContainer
      title={title}
      description={description}
      isLoading={isLoading}
      isEmpty={data.length === 0}
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={map(CHART_COLORS, (color) => color)[index]}
              />
            ))}
          </Pie>
          <Tooltip
            content={(props: TooltipProps<number, string>) =>
              ChartTooltip({ props, total })
            }
          />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span className="text-neutral-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const ChartTooltip: React.FC<RenderTooltipProps> = ({ props, total }) => {
  const { active, payload } = props;

  if (active && payload && payload.length) {
    const value = payload[0].value;
    const percent = (Number(value) * 100) / total;

    return (
      <div className="rounded-lg bg-neutral-200 p-1 shadow-md">
        {largeNumbersFormatter(value as number)}/{percent.toFixed(2)}%
      </div>
    );
  }

  return null;
};

type RenderTooltipProps = {
  props: TooltipProps<number, string>;
  total: number;
};

type Props = {
  data: PieData[];
  title: string;
  description: string;
  isLoading: boolean;
};

type PieData = {
  name: string;
  value: number;
};
