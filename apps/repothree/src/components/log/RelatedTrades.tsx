import { api } from "~/utils/api";
import React from "react";
import ErrorMessage from "../atoms/ErrorMessage";
import TradeOverviewCard from "../atoms/TradeOverviewCard";
import { tradingStrategyFriendlyNames } from "../strategy/data";

const RelatedTrades: React.FC<{ tradeId: string }> = ({ tradeId }) => {
  const {
    data: trades,
    error,
    isLoading,
    // @ts-ignore
  } = api.trades.getRelatedOptionTrades.useQuery({ id: tradeId });

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
      <>
        <p className="mt-4 text-xl font-bold">Related Trades</p>
        <ErrorMessage>
          Error loading related trades, try refreshing the page.
        </ErrorMessage>
      </>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <>
        <p className="mt-4 text-xl font-bold">Related Trades</p>
        <div className="flex w-full items-center justify-center">
          <p className="text-neutral-700">No related trades found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/*@ts-ignore*/}
      {trades.map((trade) => (
        <>
          <p className="mt-4 text-xl font-bold">
            {tradingStrategyFriendlyNames[trade.strategy]} with
          </p>
          <TradeOverviewCard
            trade={trade.trade}
            href={`/strategy?openCreate=true&tradeId=${trade.trade.id}&tradeId=${tradeId}&tradingStrategy=${trade.strategy}`}
            hrefName="Combine into Strategy"
            assetType={trade.trade.entries[0].transaction.assetType}
          />
        </>
      ))}
    </>
  );
};
export default RelatedTrades;
