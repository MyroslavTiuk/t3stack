import { PieChartTemplate } from "./charts/pieChartTemplate/pieChartTemplate";
import { api } from "~/utils/api";

const WinLossRatio = () => {
  const { data, isLoading } = api.analytics.getWinLoss.useQuery();

  return (
    <PieChartTemplate
      title="Win-loss ratio"
      description="Number of trades (equity and options) that were profitable vs. unprofitable."
      data={data ?? []}
      isLoading={isLoading}
    />
  );
};

export default WinLossRatio;
