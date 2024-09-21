import React from "react";
import { type Row, type SortingState } from "@tanstack/react-table";
import { type ScannerTableRow } from "../optionScannerTable/tableDefinition";
import { type LoadTradeData, useLoadTradeData } from "./loadTradeData";
import { type Strategy } from "@data/strategies.data";
import { type TradeFilters } from "src/server/router/scanner";
import { type TradeSetup } from "optionscout-database";

// We use this component to call the useLoadTradeData hook for each stock in a dummy
// component that does not render anything. This way we follow the rules of hooks when
// the number of stocks changes between renders
const TradeLoader: React.FC<Props> = ({
  rows,
  tradeLoaderCallbacks,
  sorting,
  loadMoreTrades,
  setLoadMoreTrades,
  tradeFilters,
  strategy,
}) => {
  return (
    <>
      {rows.map(
        (row) =>
          row.depth === 0 && (
            <Dummy
              key={row.id}
              symbol={row.original.symbol}
              tradeLoaderCallbacks={tradeLoaderCallbacks}
              sorting={sorting}
              enabled={row.getIsExpanded()}
              loadMoreTrades={loadMoreTrades}
              setLoadMoreTrades={setLoadMoreTrades}
              tradeFilters={{ ...tradeFilters }}
              strategy={strategy}
            />
          )
      )}
    </>
  );
};

const Dummy: React.FC<LoadTradeData> = (props) => {
  useLoadTradeData(props);
  return null;
};

type Props = {
  rows: Row<ScannerTableRow>[];
  tradeLoaderCallbacks: TradeLoaderCallbacks;
  sorting: SortingState;
  loadMoreTrades: string | null;
  setLoadMoreTrades: (loadMoreTrades: string | null) => void;
  tradeFilters: TradeFilters;
  strategy: Strategy;
};

export type TradeLoaderCallbacks = {
  setTradeData: React.Dispatch<
    React.SetStateAction<{ [symbol: string]: TradeSetup[] }>
  >;
  setMoreTradesAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  setTradeLoadError: React.Dispatch<any>;
};

export default TradeLoader;
