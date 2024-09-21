import Chart from "~/components/portfolio/Chart";
import { api } from "~/utils/api";
import { chartColors } from "~/components/portfolio/Card";

export default function OptionsByQuantityChart() {
  const { data } = api.analytics.getQuantityBySymbol.useQuery();
  return (
    <Chart
      data={data?.stocks.map(
        (stock: { symbol: any; _sum: { quantity: any } }, index: number) => ({
          symbol: stock.symbol,
          quantity: stock._sum.quantity || 0,
          color: chartColors[index % 5],
        })
      )}
    />
  );
}
