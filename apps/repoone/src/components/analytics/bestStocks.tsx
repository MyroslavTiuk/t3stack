import { api } from "~/utils/api";
import BarChart from "../charts/barChart";

const BestStocks = () => {
  const { data, isLoading } = api.analytics.getIncomeByStock.useQuery();
  return (
    <BarChart
      title="Best stocks"
      description="These stocks have the highest overall profit in your trading history. This considers stock and options trades."
      data={data?.best ?? []}
      isLoading={isLoading}
    />
  );
};

export default BestStocks;
