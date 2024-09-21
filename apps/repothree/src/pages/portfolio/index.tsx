import { type NextPage } from "next";
import React, { useMemo, useState } from "react";
import Header from "~/components/layout/header/header";
import { TableHeader } from "~/components/log/TableHeader";
import Card from "~/components/atoms/card";
import StocksByQuantityChart from "~/components/portfolio/StocksByQuantityChart";
import StocksTable from "~/components/portfolio/StocksTable";
import OptionsByQuantityChart from "~/components/portfolio/OptionsByQuantityChart";
import OptionsTable from "~/components/portfolio/OptionsTable";
import SharesCallsPuts from "~/components/analytics/sharesCallsPuts";
import BestStocks from "~/components/analytics/bestStocks";
import WorstStocks from "~/components/analytics/worstStocks";
import WinLossRatio from "~/components/analytics/winLossRatio";
import IncomeByDayOfWeek from "~/components/analytics/incomeByDayOfWeek";
import IncomeByStrategy from "~/components/analytics/incomeByStrategy";
import { api } from "~/utils/api";
import LineChart from "~/components/charts/lineChart";
import { TradingStrategy } from "trackgreeks-database/client";
import { Status } from "~/components/strategies/filters";
import { tanstackTableToPrismaSorting } from "~/utils/format";

const startDate = new Date("01-01-1970");
const endDate = new Date();
const PortfolioPage: NextPage = () => {
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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
      <Header />
      <div className="p-4">
        <TableHeader
          startDate={startDate}
          endDate={endDate}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          setStartDate={() => {}}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          setEndDate={() => {}}
          title="Portfolio"
          disableControls
        >
          <div className="flex flex-col border-t border-gray-200 py-4 sm:flex-row">
            <LineChart
              title="Total P&L"
              className="h-full border-r border-gray-300 pr-4"
              data={strategiesData ?? []}
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
        <div className="mt-6 flex flex-col justify-center gap-4">
          <h1 className="mb-2 text-2xl font-extrabold uppercase">Stocks</h1>
          {quantityData && quantityData.stocks.length !== 0 ? (
            <Card className="flex justify-between gap-16">
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
            <Card className="flex justify-between gap-16">
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
};

export default PortfolioPage;
