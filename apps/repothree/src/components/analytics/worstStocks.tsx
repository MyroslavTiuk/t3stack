import { BarChartTemplate } from "./charts/barChartTemplate/barChartTemplate";
import { api } from "~/utils/api";

const WorstStocks = () => {
  const { data, isLoading } = api.analytics.getIncomeByStock.useQuery();

  return (
    <BarChartTemplate
      title="Worst stocks"
      description="These stocks have the highest overall losses in your trading history. This considers stock and options trades."
      data={data?.worst ?? []}
      isLoading={isLoading}
    />
  );
};

export default WorstStocks;
