import React from "react";
import {
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  type TooltipProps,
} from "recharts";

import Card from "~/components/atoms/card";
import Tooltip from "~/components/atoms/tooltip";
import { FiInfo } from "react-icons/fi";
import TooltipContainer from "../tooltipContainer";

import { CHART_COLORS } from "../chartColors";

export const AreaChartTemplate: React.FC<Props> = ({
  title,
  description,
  isLoading,
  data,
}) => {
  const favoriteStockRange = data.reduce(
    (acc, item) => {
      const highest =
        acc.max > item.favoriteStock ? acc.max : item.favoriteStock;
      const lowest =
        acc.min < item.favoriteStock ? acc.min : item.favoriteStock;

      return { max: highest, min: lowest };
    },
    { max: data?.[0].favoriteStock, min: data?.[0].favoriteStock }
  );

  const offsetFavoriteStock =
    Math.abs(favoriteStockRange.max) /
    (Math.abs(favoriteStockRange.max) + Math.abs(favoriteStockRange.min));

  const favoritePortfolio = data.reduce(
    (acc, item) => {
      const highest = acc.max > item.portfolio ? acc.max : item.portfolio;
      const lowest = acc.min < item.portfolio ? acc.min : item.portfolio;

      return { max: highest, min: lowest };
    },
    { max: data?.[0].portfolio, min: data?.[0].portfolio }
  );

  const offsetPortfolio =
    Math.abs(favoritePortfolio.max) /
    (Math.abs(favoritePortfolio.max) + Math.abs(favoritePortfolio.min));

  return (
    <div className="mx-auto w-full px-4">
      <Card>
        <div className="flex items-center justify-between border-b-2 pb-4">
          <h3 className="text-lg">{title}</h3>
          <Tooltip message={description}>
            <FiInfo className="h-6 w-6" />
          </Tooltip>
        </div>
        {isLoading ? (
          <div className="mt-4 flex  w-full animate-pulse items-baseline space-x-6">
            <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-56 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-64 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-56 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-80 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-80 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
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
                <linearGradient
                  id="fillFavoriteStock"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset={0} stopColor={CHART_COLORS.green} />
                  <stop
                    offset={offsetFavoriteStock}
                    stopColor={CHART_COLORS.green}
                    stopOpacity={0}
                  />
                  <stop
                    offset={offsetFavoriteStock}
                    stopColor={CHART_COLORS.red}
                    stopOpacity={0}
                  />
                  <stop offset="100%" stopColor={CHART_COLORS.red} />
                </linearGradient>
                <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={0} stopColor={CHART_COLORS.green} />
                  <stop
                    offset={offsetPortfolio}
                    stopColor={CHART_COLORS.green}
                    stopOpacity={0}
                  />
                  <stop
                    offset={offsetPortfolio}
                    stopColor={CHART_COLORS.red}
                    stopOpacity={0}
                  />
                  <stop offset="100%" stopColor={CHART_COLORS.red} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" angle={-45} textAnchor="end" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <ReferenceLine y={0} stroke="#9A93B4" />
              <ChartTooltip content={ChartTooltipContent} />
              <Area
                type="monotone"
                dataKey="favoriteStock"
                name="Favorite stock"
                stroke={CHART_COLORS.blue}
                fillOpacity={1}
                strokeWidth={4}
                fill="url(#fillFavoriteStock)"
              />
              <Area
                type="monotone"
                dataKey="spy"
                name="SPY"
                stroke={CHART_COLORS.black}
                fillOpacity={1}
                strokeWidth={4}
                fill="url(#)"
              />
              <Area
                type="monotone"
                dataKey="portfolio"
                name="Portfolio"
                stroke={CHART_COLORS.green}
                fillOpacity={1}
                strokeWidth={4}
                fill="url(#fillPortfolio)"
              />
              <Legend
                iconType="circle"
                iconSize={10}
                formatter={(value) => (
                  <span className="text-neutral-700">{value}</span>
                )}
                wrapperStyle={{ bottom: 10 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};

const ChartTooltipContent: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const [
      { value: favoriteStockVal, name: favoriteStockName },
      { value: spyVal, name: spyName },
      { value: portfolioVal, name: portfolioName },
    ] = payload;

    return (
      <TooltipContainer>
        <div className="flex items-center gap-x-1 text-blue-600">
          <div className={`h-3 w-3 rounded-full bg-blue-600`} />
          {favoriteStockName}: {favoriteStockVal}%
        </div>
        <div className="flex items-center gap-x-1 text-neutral-800">
          <div className={`h-3 w-3 rounded-full bg-neutral-800`} />
          {spyName}: {spyVal}%
        </div>
        <div className="flex items-center gap-x-1 text-teal-600">
          <div className={`h-3 w-3 rounded-full bg-teal-600`} />
          {portfolioName}: {portfolioVal}%
        </div>
      </TooltipContainer>
    );
  }

  return null;
};

type Props = {
  title: string;
  description: string;
  isLoading: boolean;
  data: {
    name: string;
    favoriteStock: number;
    spy: number;
    portfolio: number;
  }[];
};
