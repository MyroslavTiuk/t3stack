import { useState, useEffect } from "react";
import { AreaChartTemplate } from "./charts/areaChartTemplate/areaChartTemplate";
import { format } from "date-fns";

const PortfolioStockSpy = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const data = [
    {
      name: format(new Date("2023-01-01"), "MMM d, yyyy"),
      favoriteStock: 1,
      spy: 5,
      portfolio: 12,
    },
    {
      name: format(new Date("2023-02-01"), "MMM d, yyyy"),
      favoriteStock: 3,
      spy: 2,
      portfolio: 1,
    },
    {
      name: format(new Date("2023-03-01"), "MMM d, yyyy"),
      favoriteStock: 6,
      spy: 3,
      portfolio: 5,
    },
    {
      name: format(new Date("2023-04-01"), "MMM d, yyyy"),
      favoriteStock: 1,
      spy: 7,
      portfolio: -5,
    },
    {
      name: format(new Date("2023-05-01"), "MMM d, yyyy"),
      favoriteStock: -10,
      spy: 11,
      portfolio: 3,
    },
    {
      name: format(new Date("2023-06-01"), "MMM d, yyyy"),
      favoriteStock: 2,
      spy: 2,
      portfolio: 1,
    },
  ];

  return (
    <AreaChartTemplate
      title="Your portfolio compared with SPY & your favorite stock"
      description="Portfolio compared with SPY & your favorite stock description."
      data={data}
      isLoading={isLoading}
    />
  );
};

export default PortfolioStockSpy;
