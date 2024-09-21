import { api } from "~/utils/api";
import HorizontalBarChart from "../charts/horizontalBarChart";

const IncomeByDayOfWeek = () => {
  const { data, isLoading } = api.analytics.getIncomeByWeekday.useQuery();

  return (
    <HorizontalBarChart
      title="Income by day of week"
      description="Profit/Loss for trades that were closed on each weekday."
      data={data ?? []}
      isLoading={isLoading}
    />
  );
};

export default IncomeByDayOfWeek;
