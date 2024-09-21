import { useState, useEffect } from "react";
import { format } from "date-fns";

import { BarLineChartTemplate } from "./charts/barLineChartTemplate/barLineChartTemplate";

const TradesVsProfit = () => {
  const [isLoading, setIsLoading] = useState(true);

  const data = [
    {
      profit: 12522,
      numberOfTrades: 37,
      date: format(new Date("2023-01-29"), "MMM d, yyyy"),
    },
    {
      profit: 500,
      numberOfTrades: 50,
      date: format(new Date("2023-02-28"), "MMM d, yyyy"),
    },
    {
      profit: -6648,
      numberOfTrades: 70,
      date: format(new Date("2023-03-29"), "MMM d, yyyy"),
    },
    {
      profit: 28956,
      numberOfTrades: 725,
      date: format(new Date("2023-04-29"), "MMM d, yyyy"),
    },
    {
      profit: 17165,
      numberOfTrades: 1725,
      date: format(new Date("2023-05-29"), "MMM d, yyyy"),
    },
    {
      profit: 10000,
      numberOfTrades: 1568,
      date: format(new Date("2023-06-29"), "MMM d, yyyy"),
    },
  ];

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 200);
  }, []);
  return (
    <BarLineChartTemplate
      isLoading={isLoading}
      title="Trades vs profit"
      description="Trades vs profit correlation description"
      data={data}
    />
  );
};

export default TradesVsProfit;
