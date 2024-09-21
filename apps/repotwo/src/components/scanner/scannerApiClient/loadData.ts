import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { type Row, type SortingState, type Table } from "@tanstack/react-table";
import { type VirtualItem } from "@tanstack/react-virtual";
import { type ScannerTableRow } from "../optionScannerTable/tableDefinition";
import { useLoadTradesPerStockData } from "./loadTradesPerStockData";
import { type Strategy } from "@data/strategies.data";
import {
  type StockFilters,
  type TradeFilters,
} from "src/server/router/scanner";
import { type Stock, type TradeSetup } from "optionscout-database";

export function useLoadScannerData(
  sorting: SortingState,
  stockFilters: StockFilters,
  tradeFilters: TradeFilters,
  strategy: Strategy,
  isScanEnabled: boolean
) {
  const {
    stocks,
    error: stockLoadError,
    ...loadStockData
  } = useLoadTradesPerStockData(
    strategy,
    sorting,
    stockFilters,
    tradeFilters,
    isScanEnabled
  );

  const [tradeData, setTradeData] = useState<{
    [symbol: string]: TradeSetup[];
  }>({});

  const [moreTradesAvailable, setMoreTradesAvailable] = useState(false);
  const [tradeLoadError, setTradeLoadError] = useState<any>(null);

  const stocksWithTrades = useMemo(
    () =>
      stocks.map((stock) => {
        const showLoader = !tradeData?.[stock.symbol] || moreTradesAvailable;
        return {
          ...stock,
          trades: [
            ...(tradeData?.[stock.symbol] ? tradeData[stock.symbol] : []),
            ...(showLoader
              ? [{ name: "loader" } as unknown as TradeSetup]
              : []),
          ],
        };
      }),
    [stocks, tradeData, moreTradesAvailable]
  );

  const tradeLoaderCallbacks = {
    setTradeData,
    setMoreTradesAvailable,
    setTradeLoadError,
  };

  return {
    stocksWithTrades,
    error: stockLoadError || tradeLoadError,
    tradeLoaderCallbacks,
    loadStockData,
  };
}

export interface StockWithTrades extends Stock {
  trades: TradeSetup[];
  numTradeSetups: number;
}

export function useLoadMoreOnScroll({
  virtualRows,
  rows,
  loadStockData,
  table,
  setLoadMoreTrades,
}: UseLoadMoreOnScroll) {
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = loadStockData;

  useEffect(() => {
    const lastItem = virtualRows?.[virtualRows.length - 1];

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= rows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    rows.length,
    virtualRows,
  ]);

  useEffect(() => {
    virtualRows.forEach((virtualRow) => {
      const row = rows[virtualRow.index];
      if (row.depth === 1) {
        const parentRow = table.getRow(row.id.split(".")[0]);
        if (
          row.index === parentRow.subRows?.[parentRow.subRows.length - 2]?.index
        ) {
          setLoadMoreTrades(parentRow.original.symbol);
        }
      }
    });
  }, [virtualRows, rows, table, setLoadMoreTrades]);
}

type UseLoadMoreOnScroll = {
  virtualRows: VirtualItem[];
  loadStockData: any;
  rows: Row<ScannerTableRow>[];
  table: Table<ScannerTableRow>;
  setLoadMoreTrades: React.Dispatch<React.SetStateAction<string | null>>;
};
