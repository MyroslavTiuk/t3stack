import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { ArrowDownLeftIcon } from "@heroicons/react/24/solid";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import Link from "next/link";
import React, { useMemo, useState } from "react";
type DataObject = {
  ticker: string;
  fullTickerName: string;
  numContracts: number;
  price: number;
  strike: string;
  expiry: Date;
  bid: number;
  ask: number;
  pop: number;
  roi: number;
  trades: string;
};
const mockData: DataObject[] = [
  {
    ticker: "SPY",
    fullTickerName: "SPDR S&P 500 ETF Trust",
    numContracts: 1,
    price: 123.55,
    strike: "23 Call",
    expiry: new Date("Jan 15, 2021"),
    bid: 232.55,
    ask: 11.5,
    pop: 70,
    roi: 20,
    trades: "",
  },
  {
    ticker: "QQQ",
    fullTickerName: "Invesco QQQ Trust",
    numContracts: 21,
    price: 135.55,
    strike: "30 Call",
    expiry: new Date("Jan 15, 2021"),
    bid: 142.55,
    ask: 138.5,
    pop: 70,
    roi: 20,
    trades: "",
  },
  {
    ticker: "NFLX",
    fullTickerName: "Netflix Inc.",
    numContracts: 5,
    price: 135.55,
    strike: "20 Call",
    expiry: new Date("Jan 13, 2021"),
    bid: 141.55,
    ask: 148.5,
    pop: 40,
    roi: 19,
    trades: "",
  },
  {
    ticker: "AMZN",
    fullTickerName: "Amazon.com, Inc.",
    numContracts: 32,
    price: 115.55,
    strike: "26 Call",
    expiry: new Date("Jan 15, 2020"),
    bid: 141.55,
    ask: 138.52,
    pop: 71,
    roi: 22,
    trades: "",
  },
  {
    ticker: "AMZN",
    fullTickerName: "Amazon.com, Inc.",
    numContracts: 32,
    price: 134.55,
    strike: "34 Call",
    expiry: new Date("Jan 15, 2023"),
    bid: 142.55,
    ask: 138.5,
    pop: 72,
    roi: 21,
    trades: "",
  },
  {
    ticker: "IWM",
    fullTickerName: "iShares Russell 2000 ETF",
    numContracts: 11,
    price: 139.55,
    strike: "39 Call",
    expiry: new Date("Jan 19, 2020"),
    bid: 149.55,
    ask: 139.5,
    pop: 79,
    roi: 29,
    trades: "",
  },
  {
    ticker: "IWM",
    fullTickerName: "S&P 500 ETF Trust",
    numContracts: 5,
    price: 135.55,
    strike: "30 Call",
    expiry: new Date("Jan 15, 2021"),
    bid: 142.55,
    ask: 138.5,
    pop: 70,
    roi: 20,
    trades: "",
  },
  {
    ticker: "IWM",
    fullTickerName: "S&P 500 ETF Trust",
    numContracts: 5,
    price: 135.55,
    strike: "30 Call",
    expiry: new Date("Jan 15, 2021"),
    bid: 142.55,
    ask: 138.5,
    pop: 70,
    roi: 20,
    trades: "",
  },
  {
    ticker: "IWM",
    fullTickerName: "iShares Russell 2000 ETF",
    numContracts: 12,
    price: 131.11,
    strike: "39 Call",
    expiry: new Date("Feb 15, 2021"),
    bid: 112.55,
    ask: 118.5,
    pop: 10,
    roi: 10,
    trades: "",
  },
  {
    ticker: "IWM",
    fullTickerName: "iShares Russell 2000 ETF",
    numContracts: 14,
    price: 134.55,
    strike: "32 Call",
    expiry: new Date("Jan 15, 2021"),
    bid: 142.55,
    ask: 138.5,
    pop: 70,
    roi: 20,
    trades: "",
  },
];

export const ScannerTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo<ColumnDef<DataObject>[]>(
    () => [
      {
        accessorKey: "ticker",
        header: "TICKER",
        cell: (info) => (
          <div className="flex flex-col text-xs">
            <div className="mb-1 flex items-center gap-1">
              <span>{info.row.original.ticker}</span>
              <span className="text-gray-500">
                ({info.row.original.numContracts} contracts)
              </span>
            </div>
            <span>{info.row.original.fullTickerName}</span>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "PRICE",
        cell: (info) => `$${info.row.original.price.toFixed(2)}`, // Format as currency
      },
      {
        accessorKey: "strike",
        header: "STRIKE",
      },
      {
        accessorKey: "expiry",
        header: "EXPIRY",
        cell: (info) =>
          info.row.original.expiry.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      },
      {
        accessorKey: "bid",
        header: "BID",
      },
      {
        accessorKey: "ask",
        header: "ASK",
      },
      {
        accessorKey: "pop",
        header: "POP",
        cell: (info) => `${info.row.original.pop}%`,
      },
      {
        accessorKey: "roi",
        header: "ROI",
        cell: (info) => `${info.row.original.roi}%`,
      },
      {
        accessorKey: "trades",
        header: "",
        cell: (info) => (
          <Link
            className="flex w-full max-w-[160px] items-center justify-center gap-2 rounded-md bg-orange py-2 text-white"
            href={`/see-more-trades/${info.row.original.ticker}`} // Example: Set the correct route
            passHref
          >
            See more trades
            <ArrowDownLeftIcon className="ml-1 h-4 w-4" />
          </Link>
        ),
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
      <h1 className="mb-8 mt-11 text-3xl">
        Your Stock list and their highest IV options
      </h1>
      <div className="p-2">
        <div className="h-2" />
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="border-b border-r bg-gray-100 px-4 py-2 text-left font-semibold"
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
