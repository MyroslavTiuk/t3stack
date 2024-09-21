import React, { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { type ComputedStrategy } from "~/server/strategies/strategies";

interface IExample {
  title?: string;
  className?: any;
  data: any;
  isLoading?: boolean;
  numberOfTrades?: number;
}

const LineChart = ({
  title,
  className,
  data,
  isLoading,
  numberOfTrades,
}: IExample) => {
  let value = null;
  let percent = "0";
  let isNegativeEarning;

  if (!isLoading && data && data.length > 0) {
    let total;
    if (title === "Win ratio") {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      total = useMemo(
        () =>
          data?.reduce((acc: any, item: { value: any }) => acc + item.value, 0),
        [data]
      );
      value = data[0]?.value;
      percent = ((Number(value) * 100) / total).toFixed(2);
    }
    if (title === "Number of trades") {
      // If it's not the win ratio, it's the merged data
      // eslint-disable-next-line react-hooks/rules-of-hooks
      total = useMemo(() => data?.length, [data]);
      // Map the merged data to an array of objects with a 'value' property
      data = data.map((item: any) => ({ value: item.quantity }));
    }
    if (title === "Total P&L") {
      // If it's not the win ratio, it's the merged data
      total = data?.reduce(
        (totalProfit: number, strategy: ComputedStrategy) => {
          // Ensure the strategy has a profit property
          // Add the strategy's profit to the total
          totalProfit += strategy.profit;
          return totalProfit;
        },
        0
      );
      // Map the merged data to an array of objects with a 'value' property
      data = data.map((item: any) => ({ value: item.profit }));
      percent = total.toFixed(2);
      value = `$${total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
    isNegativeEarning = percent && Number(percent) < 0;
  }

  const earningColor = isNegativeEarning ? "#9B1C1C" : "#03543F";
  const earningBGColor = isNegativeEarning ? "#FDE8E8" : "#DEF7EC";

  return (
    <ResponsiveContainer>
      <div className={`flex flex-col ${className}`}>
        <div className="flex items-center justify-between">
          <p className="text-gray-500">{title}</p>
          <p
            className="mr-2 rounded px-[10px] py-[2px]"
            style={{ color: earningColor, backgroundColor: earningBGColor }}
          >
            {!isNegativeEarning && "+"}
            {percent || numberOfTrades}%
          </p>
        </div>
        <h2 className="text-3xl font-bold">{value || numberOfTrades}</h2>
        <AreaChart
          width={340}
          height={50}
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#319795" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#319795" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#319795"
            fill="url(#colorUv)"
          />
        </AreaChart>
      </div>
    </ResponsiveContainer>
  );
};

export default LineChart;
