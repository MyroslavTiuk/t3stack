import { PieChartTemplate } from "./charts/pieChartTemplate/pieChartTemplate";
import { api } from "~/utils/api";

const SharesCallsPuts = () => {
  const { data, isLoading } = api.analytics.getSharesCallsPuts.useQuery();

  return (
    <PieChartTemplate
      title="Shares vs calls vs puts"
      description="The amount of transactions in your trading history relating to shares, call options and put options"
      data={data ?? []}
      isLoading={isLoading}
    />
  );
};

export default SharesCallsPuts;
