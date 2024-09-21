import { type NextPage } from "next";
import React, { useMemo } from "react";

import MonthView from "~/components/FlowBite/CalendarView";
import OpenPosition from "~/components/FlowBite/OpenPosition";
// import { TabsComponent } from "~/components/FlowBite/Tabs";
import { TableHeader } from "~/components/log/TableHeader";
import LineChart from "~/components/charts/lineChart";
import { api } from "~/utils/api";

import { useState } from "react";
import { sub } from "date-fns";
import { Status } from "~/components/strategies/filters";
import { tanstackTableToPrismaSorting } from "~/utils/format";
import { TradingStrategy } from "../../../../../../packages/opcalc-database";
import { Card } from "flowbite-react";

const Log: NextPage = () => {
  const [startDate, setStartDate] = React.useState<Date>(
    sub(new Date(), { days: 7 })
  );
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const { data, isLoading } = api.analytics.getWinLoss.useQuery();
  const { data: optionsData, isLoading: optionsLoading } =
    api.transactions.getOptionTransactions.useQuery({
      startDate: startDate,
      endDate: endDate,
    });

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
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          title="Dashboard"
        >
          <div className="flex flex-col gap-10 border-t border-gray-200 py-4 sm:flex-row sm:gap-0">
            <LineChart
              title="Total P&L"
              className="h-full border-b border-gray-300 pr-4 sm:border-b-0 sm:border-r"
              data={strategiesData?.strategies ?? []}
              // numberOfTrades={totalPL}
              isLoading={strategiesLoading}
            />
            <LineChart
              title="Number of trades"
              className="h-full border-b border-gray-300 px-4 sm:border-b-0 sm:border-r"
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
        <div className="flex w-full max-w-full flex-col gap-4 lg:flex-row">
          <Card className="w-full">
            <OpenPosition
              filters={{
                startDate: startDate,
                endDate: endDate,
                tradingStrategies: [
                  "BuyAndHold",
                  "ShortAndHold",
                  "BuyAndSell",
                  "ShortAndBuy",
                  "CoveredCall",
                  "LongCallSpread",
                  "LongPutSpread",
                  "ShortCallSpread",
                  "ShortPutSpread",
                  "Custom",
                ],
                status: [Status.Open],
              }}
            />
          </Card>
          <MonthView />
        </div>
        {/* todo, this is not working properly */}
        {/* <TabsComponent /> */}
      </div>
    </>
  );
};

export default Log;
