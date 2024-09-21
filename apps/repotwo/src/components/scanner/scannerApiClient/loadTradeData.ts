import { type SortingState } from "@tanstack/react-table";
import { trpc } from "@utils/trpc";
import React, { useEffect } from "react";
import {
  type TradeFilters,
  type TradeOrderBy,
} from "src/server/router/scanner";
import { type TradeLoaderCallbacks } from "./tradeLoader";

const fetchSize = 25;

export function useLoadTradeData({
  strategy,
  symbol,
  enabled,
  tradeLoaderCallbacks,
  sorting,
  loadMoreTrades,
  setLoadMoreTrades,
  tradeFilters,
}: LoadTradeData) {
  const { setTradeData, setTradeLoadError, setMoreTradesAvailable } =
    tradeLoaderCallbacks;

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, error } =
    trpc.scanner.trades.useInfiniteQuery(
      {
        strategy,
        tradeFilters,
        symbol,
        orderBy: transformOrdering(sorting),
        limit: fetchSize,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: true,
        enabled,
      }
    );

  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.trades) ?? [],
    [data]
  );

  useEffect(() => {
    flatData.length > 0 &&
      setTradeData((tradeData) => ({
        ...tradeData,
        [symbol]: flatData,
      }));
  }, [setTradeData, flatData, symbol]);

  useEffect(() => {
    error && setTradeLoadError(error);
  }, [setTradeLoadError, error]);

  useEffect(() => {
    if (!hasNextPage) {
      setLoadMoreTrades(null);
    }
    if (loadMoreTrades === symbol && !isFetchingNextPage) {
      setLoadMoreTrades(null);
      fetchNextPage();
    }
  }, [
    loadMoreTrades,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    symbol,
    setLoadMoreTrades,
  ]);

  useEffect(() => {
    setMoreTradesAvailable(!!hasNextPage);
  }, [setMoreTradesAvailable, hasNextPage]);
}

function transformOrdering(sorting: SortingState): TradeOrderBy {
  if (sorting.length === 0) {
    return undefined;
  }
  const stockOrderBy: TradeOrderBy = {};
  sorting.forEach((column) => {
    stockOrderBy[column.id as keyof Exclude<TradeOrderBy, undefined>] =
      column.desc ? "desc" : "asc";
  });
  return stockOrderBy;
}

export type LoadTradeData = {
  strategy: string;
  symbol: string;
  enabled: boolean;
  sorting: SortingState;
  tradeLoaderCallbacks: TradeLoaderCallbacks;
  loadMoreTrades: string | null;
  setLoadMoreTrades: (loadMoreTrades: string | null) => void;
  tradeFilters: TradeFilters;
};
