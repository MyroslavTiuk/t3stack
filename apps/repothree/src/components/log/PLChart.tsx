import React from "react";
import Card from "../atoms/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "../analytics/charts/chartColors";
import { format, fromUnixTime, getUnixTime } from "date-fns";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";

type ChartEntry = {
  date: Date;
  profit: number;
};

const PLChart: React.FC<{
  entries: ChartEntry[];
}> = ({ entries }) => {
  const data = entries.map((entry) => ({
    x: getUnixTime(entry.date),
    y: entry.profit,
  }));

  const range = entries.reduce(
    (acc, entry) => {
      const highest = acc.max > entry.profit ? acc.max : entry.profit;
      const lowest = acc.min < entry.profit ? acc.min : entry.profit;

      return { max: highest, min: lowest };
    },
    { max: entries?.[0].profit, min: entries?.[0].profit }
  );

  const offset =
    Math.abs(range.max) / (Math.abs(range.max) + Math.abs(range.min));

  return (
    <Card>
      <ResponsiveContainer height={450}>
        <AreaChart
          data={data}
          margin={{
            top: 20,
            left: 5,
            bottom: 60,
            right: 10,
          }}
        >
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset={0} stopColor={CHART_COLORS.green} />
              <stop
                offset={offset}
                stopColor={CHART_COLORS.green}
                stopOpacity={0}
              />
              <stop
                offset={offset}
                stopColor={CHART_COLORS.red}
                stopOpacity={0}
              />
              <stop offset="100%" stopColor={CHART_COLORS.red} />
            </linearGradient>
            <linearGradient id="stroke" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset={offset}
                stopColor={CHART_COLORS.green}
                stopOpacity={1}
              />
              <stop
                offset={offset}
                stopColor={CHART_COLORS.red}
                stopOpacity={1}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="x"
            angle={-45}
            textAnchor="end"
            tickFormatter={(date) => format(fromUnixTime(date), "MMM d, yyyy")}
            type="number"
            domain={["dataMin", "dataMax"]}
          />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <ReferenceLine y={0} stroke="#9A93B4" />
          <Tooltip
            cursor={{ stroke: CHART_COLORS.black, strokeWidth: 1 }}
            content={CustomTooltip}
          />
          <Area
            type="linear"
            dataKey="y"
            name="P/L"
            stroke="url(#stroke)"
            strokeWidth={2}
            fillOpacity={0.6}
            dot={{
              stroke: CHART_COLORS.black,
              r: 3,
              fill: CHART_COLORS.black,
              fillOpacity: 1,
            }}
            fill="url(#fill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col gap-1 rounded-md border-none bg-white shadow-md">
        <p>{format(fromUnixTime(label), "MMM d, yyyy")}</p>
        <div className="flex">
          {payload[0].value && payload[0].value >= 0 ? (
            <ArrowTrendingUpIcon className="h-6 w-6 text-teal-600" />
          ) : (
            <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />
          )}
          <p>${payload[0].value?.toFixed(2)}</p>
        </div>
      </div>
    );
  }
  return null;
};

export default PLChart;
