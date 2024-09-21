import { HorizontalBarChartTemplate } from "./charts/horizontalBarChart/horizontalBarChartTemplate";
import { api } from "~/utils/api";

const IncomeByDayOfWeek = () => {
  const { data, isLoading } = api.analytics.getIncomeByWeekday.useQuery();

  return (
    <HorizontalBarChartTemplate
      title="Income by day of week"
      description="Profit/Loss for trades that were closed on each weekday."
      data={data ?? []}
      isLoading={isLoading}
    />
  );
};

export default IncomeByDayOfWeek;
