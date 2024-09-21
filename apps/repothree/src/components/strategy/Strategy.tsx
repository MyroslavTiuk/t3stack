import { api } from "~/utils/api";
import React from "react";
import ErrorMessage from "../atoms/ErrorMessage";
import { formatDate } from "~/utils/format";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";
import TradeOverviewCard from "../atoms/TradeOverviewCard";
// @ts-ignore
import { AssetType } from "trackgreeks-database";
import Card from "../atoms/card";
import TransactionTable from "../log/TransactionTable";
import { tradingStrategyFriendlyNames } from "./data";
import PLChart from "../log/PLChart";

const Strategy: React.FC<Props> = ({ strategyId }) => {
  const { data, error, isLoading } = api.strategies.getStrategy.useQuery({
    id: strategyId,
  });

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex w-full animate-pulse flex-col items-center"
      >
        {[...Array(4).keys()].map((number) => (
          <div
            key={number}
            className="mt-2 h-20 w-full rounded-lg bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage>
        Error loading strategy, try refreshing the page.
      </ErrorMessage>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <p className="text-neutral-700">Trade not found.</p>
      </div>
    );
  }
  // @ts-ignore
  const { strategy, profit, startDate, endDate, tradeEntries } = data;

  return (
    <div className="flex w-full justify-center">
      <div className="my-4 flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-neutral-700">{strategy.name}</p>
          <p className="text-neutral-500">
            {startDate ? formatDate(startDate) : ""} -{" "}
            {endDate ? formatDate(endDate) : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {profit >= 0 ? (
            <ArrowTrendingUpIcon className="h-6 w-6 text-teal-600" />
          ) : (
            <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />
          )}
          <p className="font-extrabold text-neutral-700">
            ${profit?.toFixed(2)}
          </p>
          <p className="rounded-md px-1 outline outline-1">
            {tradingStrategyFriendlyNames[strategy.tradingStrategy]}
          </p>
        </div>
        <p className="text-xl font-bold">{strategy.trades.length} Trades</p>
        {/*@ts-ignore*/}
        {strategy.trades.map((trade) => (
          <TradeOverviewCard
            key={trade.id}
            trade={trade}
            assetType={AssetType.Option}
            href={`/log/${trade.id}`}
          />
        ))}

        {tradeEntries.length > 1 && (
          <>
            <p className="mt-5 text-xl font-bold">Profit/Loss</p>
            <PLChart
              // @ts-ignore
              entries={tradeEntries.map((entry) => ({
                date: entry.transaction.date,
                profit: entry.profit,
              }))}
            />
          </>
        )}
        <p className="text-xl font-bold">
          {tradeEntries.length} total transactions
        </p>
        <Card>
          <div className="max-w-[90vw] overflow-auto">
            <TransactionTable entries={tradeEntries} isStrategy={true} />
          </div>
        </Card>
      </div>
    </div>
  );
};

type Props = {
  strategyId: string;
};

export default Strategy;
