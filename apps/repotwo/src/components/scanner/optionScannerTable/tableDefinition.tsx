import React from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Flex } from "@chakra-ui/react";
import { BiLinkExternal } from "react-icons/bi";
import { Button, IconButton, Text } from "@chakra-ui/react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { addDays, format } from "date-fns";
import { thousandSeparator } from "@utils/thousandSeparator";
import { type StockWithTrades } from "../scannerApiClient/loadData";
import { formatWithMultiplier } from "@utils/multipliers";
import { type Stock, type TradeSetup } from "optionscout-database";
import { type ModalTrade } from "../tradeModal";

export function useOptionScannerTable({
  stocksWithTrades,
  setOnModalButtonClick,
  sorting,
  setSorting,
}: UseOptionScannerTable) {
  const columnHelper = createColumnHelper<ScannerTableRow>();
  const columns = [
    columnHelper.accessor((row) => (isStockRow(row) ? row.symbol : row.name), {
      id: "id",
      header: "Name",
      cell: ({ row, getValue }) => {
        const id = getValue();
        if (id === "loader") {
          return null;
        }
        return (
          <Flex alignItems="center" justifyContent="space-between">
            <Box>
              <Text noOfLines={1}>{id}</Text>
              {isStockRow(row.original) && (
                <Text fontSize="xs">
                  {thousandSeparator(row.original.numTradeSetups)} trades
                </Text>
              )}
            </Box>
            {row.getCanExpand() && (
              <IconButton
                ml={10}
                aria-label="show trades"
                onClick={row.getToggleExpandedHandler()}
                icon={
                  row.getIsExpanded() ? <AiOutlineMinus /> : <AiOutlinePlus />
                }
                data-testid="show-trades-button"
              />
            )}
          </Flex>
        );
      },
    }),
    columnHelper.display({
      id: "showData",
      cell: ({ row }) => {
        if (!isStockRow(row.original) && row.original.name !== "loader") {
          const parentRow = table.getRow(row.id.split(".")[0]);
          return (
            <Button
              bg="button.orange.700"
              color="background.50"
              onClick={setOnModalButtonClick({
                ...row.original,
                stock: parentRow.original as Stock,
              })}
              position="static"
            >
              <Text mr="2">Data</Text>
              <BiLinkExternal />
            </Button>
          );
        }
      },
    }),
    columnHelper.accessor((row) => (isStockRow(row) ? row.price : null), {
      header: "Stock price",
      id: "price",
      cell: ({ table, row, getValue }) => {
        if (isStockRow(row.original)) {
          const price = getValue();
          return price?.toFixed(2);
        }
        const parentRow = table.getRow(row.id.split(".")[0]);
        const parentPrice = (parentRow as Row<StockWithTrades>).original.price;
        return parentPrice?.toFixed(2);
      },
    }),
    columnHelper.accessor(
      (row) => (isStockRow(row) ? null : row.daysToExpiration),
      {
        id: "daysToExpiration",
        header: "Expiration",
        cell: ({ getValue }) => {
          const daysToExpiration = getValue();
          if (!daysToExpiration) {
            return null;
          }

          const formattedDate = format(
            addDays(new Date(), daysToExpiration),
            "MM/dd/yyyy"
          );
          const pluralSuffix = daysToExpiration === 1 ? "" : "s";
          return `${daysToExpiration.toFixed()} day${pluralSuffix} (${formattedDate})`;
        },
      }
    ),
    columnHelper.accessor(
      (row) =>
        !isStockRow(row) && row.iv ? (row.iv * 100).toFixed() + "%" : null,
      {
        id: "iv",
        header: "IV",
      }
    ),
    columnHelper.accessor((row) => (!isStockRow(row) ? row.otmPercent : null), {
      id: "otmPercent",
      header: "OTM %",
      cell: ({ getValue }) => {
        const otm = getValue();
        if (!otm) {
          return null;
        }
        if (otm >= 0) {
          return (otm * 100).toFixed() + "% OTM";
        }
        return (-otm * 100).toFixed() + "% ITM";
      },
    }),
    columnHelper.accessor(
      (row) =>
        !isStockRow(row) && row.pop
          ? Math.min(row.pop * 100, 99).toFixed() + "%"
          : null,
      {
        id: "pop",
        header: "Prob. of Profit",
      }
    ),
    columnHelper.accessor(
      (row) => (isStockRow(row) ? null : row.bidAskSpread?.toFixed(2)),
      { id: "bidAskSpread", header: "Bid/Ask Spread" }
    ),
    columnHelper.accessor((row) => (isStockRow(row) ? null : row.netCredit), {
      id: "netCredit",
      header: "Net Credit",
      cell: ({ getValue }) => {
        const netCredit = getValue();
        if (!netCredit) {
          return null;
        }
        if (netCredit >= 0) {
          return (netCredit * 100).toFixed(2) + " NC";
        }
        return (-(netCredit * 100)).toFixed(2) + " ND";
      },
    }),
    columnHelper.accessor((row) => row.volume, {
      id: "volume",
      header: "Volume",
      cell: ({ getValue }) => {
        const volume = getValue();
        if (volume) {
          return thousandSeparator(volume);
        }
      },
    }),
    columnHelper.accessor(
      (row) =>
        isStockRow(row) && row.marketCap
          ? formatWithMultiplier(row.marketCap * 1000000)
          : null,
      {
        header: "Market Cap",
        id: "market_cap",
      }
    ),
    columnHelper.accessor(
      (row) => (isStockRow(row) && row.peRatio ? row.peRatio.toFixed(1) : null),
      {
        header: "P/E Ratio",
        id: "pe_ratio",
      }
    ),
    columnHelper.accessor(
      (row) =>
        isStockRow(row) && row.dividendYield
          ? row.dividendYield.toFixed() + "%"
          : null,
      {
        header: "Dividend Yield",
        id: "dividend_yield",
      }
    ),
  ];

  const table = useReactTable({
    columns,
    data: stocksWithTrades,
    getCoreRowModel: getCoreRowModel(),
    getSubRows: (row: ScannerTableRow) => (isStockRow(row) ? row.trades : []),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });
  return { table, columnCount: columns.length };
}

type UseOptionScannerTable = {
  stocksWithTrades: StockWithTrades[];
  setOnModalButtonClick: (modalTrade: ModalTrade) => () => void;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

function isStockRow(row: any): row is StockWithTrades {
  return row.trades !== undefined;
}

export function useRowVirtualizer(rows: Row<ScannerTableRow>[]) {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 70,
    overscan: 10,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  return {
    tableContainerRef,
    virtualRows,
    virtualPadding: {
      top: paddingTop,
      bottom: paddingBottom,
    },
  };
}

export type ScannerTableRow = StockWithTrades | TradeSetup;
