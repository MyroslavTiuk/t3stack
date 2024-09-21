import { api } from "~/utils/api";
import BarChart from "../charts/barChart";

const IncomeByStrategy = () => {
  const { data, isLoading } = api.analytics.getIncomeByStrategy.useQuery();

  return (
    <BarChart
      title="Income by strategy"
      description="Income by trading strategy that you defined in the trade log."
      data={data ?? []}
      isLoading={isLoading}
    />
  );
};

export default IncomeByStrategy;
