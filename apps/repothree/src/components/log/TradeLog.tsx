import { api } from "~/utils/api";
import React from "react";
import ErrorMessage from "../atoms/ErrorMessage";
import Card from "../atoms/card";
import TransactionTable from "./TransactionTable";
import {
  ArrowTopRightOnSquareIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";
import PLChart from "./PLChart";
import { formatDate } from "~/utils/format";
import RelatedTrades from "./RelatedTrades";
// @ts-ignore
import { AssetType } from "trackgreeks-database";
import Link from "next/link";
import StrategyCard from "../atoms/StrategyCard";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import EditTransactionsDialog from "./EditDialog";

const TradeLog: React.FC<{ tradeId: string }> = ({ tradeId }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  // @ts-ignore
  const { data, error, isLoading } = api.trades.getTrade.useQuery({
    id: tradeId,
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
      <ErrorMessage>Error loading trade, try refreshing the page.</ErrorMessage>
    );
  }

  if (!data || !data.trade) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <p className="text-neutral-700">Trade not found.</p>
      </div>
    );
  }

  function getChartEntries() {
    if (!data || data.trade.entries.length === 0) return [];
    if (data.trade.endDate || !data.currentPrice) {
      // @ts-ignore
      return data.trade.entries.map((entry) => ({
        date: entry.transaction.date,
        profit: entry.profit,
      }));
    }
    return [
      // @ts-ignore
      ...data.trade.entries.map((entry) => ({
        date: entry.transaction.date,
        profit: entry.profit,
      })),
      { date: new Date(), profit: data.profit },
    ];
  }
  const chartEntries = getChartEntries();

  return (
    <div className="flex w-full justify-center">
      <div className="my-4 flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-neutral-700">
            {data.trade.name}
          </p>
          {data.currentPrice && (
            <p className="px-4 text-3xl text-neutral-700">
              ${data.currentPrice}
            </p>
          )}
          <p className="text-neutral-500">
            {formatDate(data.trade.startDate)} -{" "}
            {data.trade.endDate ? formatDate(data.trade.endDate) : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {data.profit >= 0 ? (
            <ArrowTrendingUpIcon className="h-6 w-6 text-teal-600" />
          ) : (
            <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />
          )}
          <p className="font-extrabold text-neutral-700">
            ${data.profit.toFixed(2)}
          </p>
          <p
            className={
              `${data.profit >= 0 ? "text-teal-600" : "text-red-400"}` +
              " align-bottom text-sm"
            }
          >
            {data.profitPercent.toFixed(1)}%
          </p>
        </div>
        {chartEntries.length > 1 && (
          <>
            <p className="mt-5 text-xl font-bold">Profit/Loss</p>
            <PLChart entries={chartEntries} />
          </>
        )}
        <div className="flex w-full justify-between">
          <p className="text-xl font-bold">
            {data.trade.entryCount} transactions
          </p>
          <button onClick={() => setIsEditDialogOpen(true)}>
            <PencilSquareIcon className="h-6 w-6" />
          </button>
          <EditTransactionsDialog
            isOpen={isEditDialogOpen}
            trade={data.trade}
            onClose={() => setIsEditDialogOpen(false)}
          />
        </div>
        <Card>
          <div className="max-w-[90vw] overflow-auto">
            <TransactionTable entries={data.trade.entries} />
          </div>
        </Card>
        {data.trade.entries[0].transaction.assetType === AssetType.Option && (
          <>
            <p className="mt-4 text-xl font-bold">Trading Strategy</p>
            {/*@ts-ignore*/}
            {data.trade.strategies.map((strategy) => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}
            {data.trade.strategies.length === 0 && (
              <>
                <p>This trade is not yet part of a trading strategy.</p>
                <Link
                  href={`/strategy?openCreate=true&tradeId=${data.trade.id}`}
                >
                  <button className="flex gap-2 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white no-underline transition hover:bg-teal-600/70">
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                    Create Strategy
                  </button>
                </Link>
              </>
            )}
            <RelatedTrades tradeId={tradeId} />
          </>
        )}
      </div>
    </div>
  );
};
export default TradeLog;
