import { BarChartTemplate } from "./charts/barChartTemplate/barChartTemplate";
import { api } from "~/utils/api";

const IncomeByStrategy = () => {
  const { data, isLoading } = api.analytics.getIncomeByStrategy.useQuery();

  return (
    <BarChartTemplate
      title="Income by strategy"
      description="Income by trading strategy that you defined in the trade log."
      data={data ?? []}
      isLoading={isLoading}
    />
  );
};

export default IncomeByStrategy;
