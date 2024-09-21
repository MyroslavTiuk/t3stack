import { BarChartTemplate } from "./charts/barChartTemplate/barChartTemplate";
import { api } from "~/utils/api";

const BestStocks = () => {
  const { data, isLoading } = api.analytics.getIncomeByStock.useQuery();

  return (
    <BarChartTemplate
      title="Best stocks"
      description="These stocks have the highest overall profit in your trading history. This considers stock and options trades."
      data={data?.best ?? []}
      isLoading={isLoading}
    />
  );
};

export default BestStocks;
