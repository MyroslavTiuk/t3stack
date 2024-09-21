import BarChart from "../charts/barChart";
import { api } from "~/utils/api";

const WorstStocks = () => {
  const { data, isLoading } = api.analytics.getIncomeByStock.useQuery();

  return (
    <BarChart
      title="Worst stocks"
      description="These stocks have the highest overall losses in your trading history. This considers stock and options trades."
      data={data?.worst ?? []}
      isLoading={isLoading}
    />
  );
};

export default WorstStocks;
