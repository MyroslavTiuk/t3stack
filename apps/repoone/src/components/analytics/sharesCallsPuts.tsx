import { api } from "~/utils/api";
import PieChart from "../charts/pieChart";

const SharesCallsPuts = () => {
  const { data, isLoading } = api.analytics.getSharesCallsPuts.useQuery();

  return (
    <PieChart
      title="Shares vs calls vs puts"
      description="The amount of transactions in your trading history relating to shares, call options and put options"
      data={data ?? []}
      isLoading={isLoading}
    />
  );
};

export default SharesCallsPuts;
