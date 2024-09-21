import Card from "~/components/portfolio/Card";
import React, { useMemo, useState } from "react";
import SharesCallsPuts from "~/components/analytics/sharesCallsPuts";
import BestStocks from "~/components/analytics/bestStocks";
import WorstStocks from "~/components/analytics/worstStocks";
import WinLossRatio from "~/components/analytics/winLossRatio";
import IncomeByDayOfWeek from "~/components/analytics/incomeByDayOfWeek";
import IncomeByStrategy from "~/components/analytics/incomeByStrategy";
import OptionsByQuantityChart from "~/components/portfolio/OptionsByQuantityChart";
import OptionsTable from "~/components/portfolio/OptionsTable";
import StocksByQuantityChart from "~/components/portfolio/StocksByQuantityChart";
import StocksTable from "~/components/portfolio/StocksTable";
import LineChart from "~/components/charts/lineChart";
import { TableHeader } from "~/components/log/TableHeader";
import { api } from "~/utils/api";
import { Status } from "~/components/strategies/filters";
import { tanstackTableToPrismaSorting } from "~/utils/format";
import { TradingStrategy } from "../../../../../../packages/opcalc-database";

const startDate = new Date("01-01-1970");
const endDate = new Date();
export default function Portfolio() {
  const { data, isLoading } = api.analytics.getWinLoss.useQuery();
  const { data: optionsData, isLoading: optionsLoading } =
    api.transactions.getOptionTransactions.useQuery({
      startDate: startDate,
      endDate: endDate,
    });

  const { data: quantityData } = api.analytics.getQuantityBySymbol.useQuery();

  const { data: stocksData, isLoading: stocksLoading } =
    api.transactions.getOptionTransactions.useQuery({
      startDate: startDate,
      endDate: endDate,
    });

  const numberOfTrades = useMemo(() => {
    if (!stocksData || !optionsData) return 0;
    return stocksData.count + optionsData.count;
  }, [optionsData, stocksData]);

  const mergedData = useMemo(() => {
    if (!stocksData || !optionsData) return [];
    return [...optionsData.trades, ...stocksData.trades];
  }, [optionsData, stocksData]);

  const [tradingStrategies] = React.useState<TradingStrategy[]>(
    Object.values(TradingStrategy)
  );

  const [sorting] = useState([{ id: "startDate", desc: true }]);

  const { data: strategiesData, loading: strategiesLoading } =
    api.strategies.getStrategies.useQuery({
      startDate,
      endDate,
      tradingStrategies,
      status: [Status.Closed, Status.Open],
      sorting: tanstackTableToPrismaSorting(sorting),
    });

  return (
    <>
      <div className="flex min-h-[100vh] w-full flex-col justify-start gap-4 bg-gray-100 p-4">
        <TableHeader
          startDate={startDate}
          endDate={endDate}
          setStartDate={() => {}}
          setEndDate={() => {}}
          title="Portfolio"
          disableControls
        >
          <div className="flex flex-col border-t border-gray-200 py-4 sm:flex-row">
            <LineChart
              title="Total P&L"
              className="h-full border-r border-gray-300 pr-4"
              data={strategiesData?.strategies ?? []}
              // numberOfTrades={totalPL}
              isLoading={strategiesLoading}
            />
            <LineChart
              title="Number of trades"
              className="h-full border-r border-gray-300 px-4"
              data={mergedData}
              numberOfTrades={numberOfTrades}
              isLoading={optionsLoading && stocksLoading}
            />
            <LineChart
              title="Win ratio"
              data={data}
              className="pl-4"
              isLoading={isLoading}
            />
          </div>
        </TableHeader>
        <div className="flex flex-col justify-center gap-4 bg-gray-100 py-4">
          <h1 className="mb-2 text-2xl font-extrabold uppercase">Stocks</h1>
          {quantityData && quantityData.stocks.length !== 0 ? (
            <Card>
              <StocksByQuantityChart />
              <StocksTable />
            </Card>
          ) : (
            <Card>
              <p className="mx-auto my-4 text-center text-neutral-700">
                No stocks in this time range, start trading and then import your
                trades.
              </p>
              <></>
            </Card>
          )}
          <h1 className="mb-2 text-2xl font-extrabold uppercase">Options</h1>
          {/* todo, this is not working */}

          {quantityData && quantityData.options.length !== 0 ? (
            <Card>
              <OptionsByQuantityChart />
              <OptionsTable />
            </Card>
          ) : (
            <Card>
              <p className="mx-auto my-4 text-center text-neutral-700">
                No options in this time range, start trading and then import
                your trades.
              </p>
              <></>
            </Card>
          )}
          <div className="mx-auto flex w-full flex-wrap justify-center gap-4 p-3">
            <SharesCallsPuts />
            <BestStocks />
            <WorstStocks />
            <WinLossRatio />
            <IncomeByDayOfWeek />
            <IncomeByStrategy />
          </div>
        </div>
      </div>
    </>
  );
}
