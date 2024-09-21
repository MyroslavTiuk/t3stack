import Table from "~/components/portfolio/Table";
import { api } from "~/utils/api";
import { chartColors } from "~/components/portfolio/Card";

export default function OptionsTable() {
  const { data } = api.analytics.getQuantityBySymbol.useQuery();
  return (
    <Table
      data={
        data?.stocks.map((stock, index) => ({
          symbol: stock.symbol,
          quantity: stock._sum.quantity || 0,
          color: chartColors[index % 5],
        })) || []
      }
    />
  );
}
