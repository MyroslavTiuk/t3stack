import Chart from "~/components/portfolio/Chart";
import { api } from "~/utils/api";
import { chartColors } from "~/components/portfolio/Card";

export default function OptionsByQuantityChart() {
  const { data } = api.analytics.getQuantityBySymbol.useQuery();
  return (
    <Chart
      data={data?.options.map(
        (
          option: { underlyingSymbol: any; _sum: { quantity: any } },
          index: number
        ) => ({
          symbol: option.underlyingSymbol,
          quantity: option._sum.quantity || 0,
          color: chartColors[index % 5],
        })
      )}
    />
  );
}
