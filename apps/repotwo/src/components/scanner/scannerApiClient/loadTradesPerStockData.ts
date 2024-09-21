import { useMemo } from "react";
import { type SortingState } from "@tanstack/react-table";
import { trpc } from "@utils/trpc";
import {
  type StockFilters,
  type StockOrderBy,
  type TradeFilters,
} from "src/server/router/scanner";

const fetchSize = 25;

export function useLoadTradesPerStockData(
  strategy: string,
  sorting: SortingState,
  stockFilters: StockFilters,
  tradeFilters: TradeFilters,
  isScanEnabled: boolean
) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isFetching,
  } = trpc.scanner.tradesPerStock.useInfiniteQuery(
    {
      strategy,
      stockFilters,
      tradeFilters,
      orderBy: transformOrdering(sorting),
      limit: fetchSize,
    },
    {
      enabled: isScanEnabled,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const flatData = useMemo(() => {
    return data?.pages?.flatMap((page) => page.stocksWithTradeCount) ?? [];
  }, [data]);

  const tradeCount = data?.pages?.[0]?.totalTradeCount ?? 0;

  return {
    stocks: flatData,
    tradeCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isFetching,
  };
}

function transformOrdering(sorting: SortingState): StockOrderBy {
  if (sorting.length === 0) {
    return undefined;
  }
  const stockOrderBy: StockOrderBy = {};
  sorting.forEach((column) => {
    stockOrderBy[column.id as keyof Exclude<StockOrderBy, undefined>] =
      column.desc ? "desc" : "asc";
  });
  return stockOrderBy;
}
