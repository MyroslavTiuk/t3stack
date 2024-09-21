import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
type DataObject = {
  ticker: string;
  stockPrice: number;
  volume: number;
  marketCap: string;
  last: number;
  bid: number;
  mid: number;
  ask: number;
  oneYr: number;
  fiveYr: number;
  beta: number;
  sector: string;
};
const mockData: DataObject[] = [
  {
    ticker: "AAPL",
    stockPrice: 122.23,
    volume: 100000,
    marketCap: "$2.7T",
    last: 144.5,
    bid: 145.25,
    mid: 146.4,
    ask: 179.55,
    oneYr: 20,
    fiveYr: 30,
    beta: 1.03,
    sector: "Computers",
  },
  {
    ticker: "AAPL",
    stockPrice: 121,
    volume: 100000,
    marketCap: "$2.5T",
    last: 149.5,
    bid: 149.25,
    mid: 149.4,
    ask: 149.55,
    oneYr: 15,
    fiveYr: 15,
    beta: 1.02,
    sector: "Computerss",
  },
];
export const StocksTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo<ColumnDef<DataObject>[]>(
    () => [
      {
        accessorKey: "ticker",
        header: "Ticker",
        cell: (info) => info.row.original.ticker,
      },
      {
        accessorKey: "stockPrice",
        header: "Stock Price",
        cell: (info) => `$${info.row.original.stockPrice.toFixed(2)}`,
      },
      {
        accessorKey: "volume",
        header: "Volume",
        cell: (info) => info.row.original.volume,
      },
      {
        accessorKey: "marketCap",
        header: "Market Cap",
        cell: (info) => info.row.original.marketCap,
      },
      {
        accessorKey: "last",
        header: "Last",
        cell: (info) => `$${info.row.original.last.toFixed(2)}`,
      },
      {
        accessorKey: "bid",
        header: "Bid",
        cell: (info) => `$${info.row.original.bid.toFixed(2)}`,
      },
      {
        accessorKey: "mid",
        header: "mid",
        cell: (info) => `$${info.row.original.mid.toFixed(2)}`,
      },
      {
        accessorKey: "ask",
        header: "Ask",
        cell: (info) => `$${info.row.original.ask.toFixed(2)}`,
      },
      {
        accessorKey: "oneYr",
        header: "1yr",
        cell: (info) => `${info.row.original.oneYr}%`,
      },
      {
        accessorKey: "fiveYr",
        header: "5yr",
        cell: (info) => `${info.row.original.fiveYr}%`,
      },
      {
        accessorKey: "beta",
        header: "Beta",
        cell: (info) => info.row.original.beta.toFixed(2),
      },
      {
        accessorKey: "sector",
        header: "Sector",
        cell: (info) => info.row.original.sector,
      },
    ],
    []
  );

  const [data] = React.useState(() => mockData);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <>
      <div className="p-2">
        <div className="h-2" />
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="border-b border-r bg-gray-100 px-4 py-2 text-left text-xs font-black uppercase"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ArrowUpIcon className="h-4 w-4" />,
                          desc: <ArrowDownIcon className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 10)
              .map((row) => (
                <tr
                  key={row.id}
                  className="border-b transition duration-300 hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border-r px-4 py-2 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
