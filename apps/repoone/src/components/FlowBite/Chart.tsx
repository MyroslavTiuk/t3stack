import React, { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface IExample {
  title?: string;
  className?: any;
  data: any;
  isLoading?: boolean;
  valluuee?: number;
}

const Example = ({
  title,
  className,
  data,
  isLoading,

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  allTrades,
}: IExample) => {
  let value = null;
  let percent = 0;
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
    }
    value = data[0].value;
    percent = (Number(value) * 100) / total;
    isNegativeEarning = percent && percent < 0;
  }
  const earningColor = isNegativeEarning ? "#9B1C1C" : "#03543F";
  const earningBGColor = isNegativeEarning ? "#FDE8E8" : "#DEF7EC";

  return (
    <ResponsiveContainer width="100%">
      <div className={`flex flex-col ${className}`}>
        <div className="flex items-center justify-between">
          <p className="text-gray-500">{title}</p>
          <p
            className="mr-2 rounded px-[10px] py-[2px]"
            style={{ color: earningColor, backgroundColor: earningBGColor }}
          >
            {!isNegativeEarning && "+"}
            {percent}%
          </p>
        </div>
        <h2 className="text-3xl font-bold">{value ?? allTrades}</h2>
        <AreaChart
          width={400}
          height={60}
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
              <stop offset="5%" stopColor="#1C64F2" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#1C64F2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#1C64F2"
            fill="url(#colorUv)"
          />
        </AreaChart>
      </div>
    </ResponsiveContainer>
  );
};

export default Example;
