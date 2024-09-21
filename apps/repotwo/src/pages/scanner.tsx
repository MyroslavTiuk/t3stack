import React, { useMemo, useState } from "react";
import { type SortingState } from "@tanstack/react-table";
import { useDisableFooter } from "@context/layoutContext";
import { Box } from "@chakra-ui/react";
import TradeModal, { type ModalTrade } from "src/components/scanner/tradeModal";
import FilterBar, {
  initialStockFilterState,
  initialTradeFilterState,
} from "src/components/scanner/filterBar/filterBar";
import OptionScannerTable from "src/components/scanner/optionScannerTable/optionScannerTable";
import {
  useOptionScannerTable,
  useRowVirtualizer,
} from "src/components/scanner/optionScannerTable/tableDefinition";
import {
  useLoadMoreOnScroll,
  useLoadScannerData,
} from "src/components/scanner/scannerApiClient/loadData";
import { strategyDescriptions, type Strategy } from "@data/strategies.data";
import StrategyDescription from "src/components/scanner/strategyDescription";
import TradeLoader from "src/components/scanner/scannerApiClient/tradeLoader";
import { useSession } from "next-auth/react";
import LoadingPage from "@atoms/LoadingPage";
import LoggedOutPage from "@atoms/LoggedOutPage";
import NotSubscribedPage from "@atoms/NotSubscribedPage";
import {
  type StockFilters,
  type TradeFilters,
} from "src/server/router/scanner";

export const DEFAULT_SCANNER_STRATEGY: Strategy = "cash-secured-put";

const Scanner: React.FC = () => {
  const [strategy, setStrategy] = useState<Strategy>(DEFAULT_SCANNER_STRATEGY);
  useDisableFooter();

  const [modalTrade, setModalTrade] = useState<ModalTrade | null>(null);
  const [isScanEnabled, setIsScanEnabled] = useState<boolean>(false);
  const setOnModalButtonClick = (trade: ModalTrade) => () =>
    setModalTrade(trade);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [stockFilters, setStockFilters] = React.useState<StockFilters>(
    initialStockFilterState
  );
  const [tradeFilters, setTradeFilters] = React.useState<TradeFilters>(
    initialTradeFilterState
  );

  const { stocksWithTrades, error, tradeLoaderCallbacks, loadStockData } =
    useLoadScannerData(
      sorting,
      stockFilters,
      tradeFilters,
      strategy,
      isScanEnabled
    );

  const { table, columnCount } = useOptionScannerTable({
    stocksWithTrades,
    setOnModalButtonClick,
    sorting,
    setSorting,
  });
  const { rows } =
    stocksWithTrades.length > 0 ? table.getRowModel() : { rows: [] };
  const { tableContainerRef, virtualRows, virtualPadding } =
    useRowVirtualizer(rows);
  const visibleRows = useMemo(
    () => virtualRows.map((virtualRow) => rows[virtualRow.index]),
    [virtualRows, rows]
  );

  const [loadMoreTrades, setLoadMoreTrades] = useState<string | null>(null);

  useLoadMoreOnScroll({
    virtualRows,
    rows,
    loadStockData,
    table,
    setLoadMoreTrades,
  });

  const description = strategyDescriptions[strategy];

  const { data, status } = useSession();

  if (status === "loading") {
    return <LoadingPage />;
  }
  if (status === "unauthenticated") {
    return <LoggedOutPage />;
  }
  // @ts-ignore
  if (!data?.user?.isActive === true) {
    return <NotSubscribedPage />;
  }

  return (
    <Box px={{ sm: 1, md: 10 }}>
      <TradeLoader
        rows={rows}
        sorting={sorting}
        tradeLoaderCallbacks={tradeLoaderCallbacks}
        loadMoreTrades={loadMoreTrades}
        setLoadMoreTrades={setLoadMoreTrades}
        tradeFilters={tradeFilters}
        strategy={strategy}
      />
      {modalTrade && (
        <TradeModal
          trade={modalTrade}
          onClose={() => setModalTrade(null)}
          strategy={strategy}
        />
      )}
      <FilterBar
        tradeCount={loadStockData.tradeCount}
        setStockFilters={setStockFilters}
        setTradeFilters={setTradeFilters}
        isScanEnabled={isScanEnabled}
        strategy={strategy}
        setStrategy={setStrategy}
        setIsScanEnabled={setIsScanEnabled}
      />
      {isScanEnabled ? (
        <OptionScannerTable
          tableContainerRef={tableContainerRef}
          headerGroups={table.getHeaderGroups()}
          rows={visibleRows}
          error={error}
          columnCount={columnCount}
          virtualPadding={virtualPadding}
          isFetchingStocks={loadStockData.isFetching}
        />
      ) : (
        <StrategyDescription description={description} />
      )}
    </Box>
  );
};

export default Scanner;
