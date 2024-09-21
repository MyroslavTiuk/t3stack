import { api } from "~/utils/api";
import PieChart from "../charts/pieChart";

const WinLossRatio = () => {
  const { data, isLoading } = api.analytics.getWinLoss.useQuery();

  return (
    <PieChart
      title="Win-loss ratio"
      description="Number of trades (equity and options) that were profitable vs. unprofitable."
      data={data ?? []}
      isLoading={isLoading}
    />
  );
};

export default WinLossRatio;
