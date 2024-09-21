/* eslint-disable no-console */
import React, { useCallback, useMemo, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/20/solid";

type DataObject = {
  transaction: string;
  symbol: string;
  price: number;
  direction: string;
  quantity: number;
  net_price: number;
};

export const TradesTable = ({ backTestCalc }: any) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 5;

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  if (backTestCalc.data.errorMessage || !backTestCalc.data.table_items) {
    return <></>;
  }

  const data = backTestCalc.data.table_items.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const columns = useMemo<ColumnDef<DataObject>[]>(
    () => [
      {
        accessorKey: "transaction",
        header: "Transaction",
        cell: (info) => info.row.original.transaction,
      },
      {
        accessorKey: "symbol",
        header: "Symbol",
        cell: (info) => info.row.original.symbol,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => `$${info.row.original.price}`,
      },
      {
        accessorKey: "direction",
        header: "Direction",
        cell: (info) => info.row.original.direction,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: (info) => info.row.original.quantity,
      },
      {
        accessorKey: "net_price",
        header: "Net Price",
        cell: (info) => `$${info.row.original.net_price.toFixed(3)}`,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });
  const handleExportExcel = useCallback(async () => {
    try {
      const tradesData = backTestCalc.data.table_items.map((item) => ({
        Transaction: item.transaction,
        Symbol: item.symbol,
        Price: item.price,
        Direction: item.direction,
        Quantity: item.quantity,
        NetPrice: item.net_price.toFixed(3),
      }));

      const wb = XLSX.utils.book_new();
      const tradesSheet = XLSX.utils.json_to_sheet(tradesData);

      XLSX.utils.book_append_sheet(wb, tradesSheet, "Trades");

      const filename = "Trades.xlsx";
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  }, [backTestCalc.data.table_items]);

  const pageCount = Math.ceil(backTestCalc.data.table_items.length / pageSize);

  const handleNextPage = () => {
    setPageIndex((prevIndex) => Math.min(prevIndex + 1, pageCount - 1));
  };

  const handlePrevPage = () => {
    setPageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handlePageClick = (page: number) => {
    setPageIndex(page);
  };
  const pageButtonsToShow = 3; // Number of page buttons to show

  const getPageButtons = () => {
    const startPage = Math.max(
      0,
      pageIndex - Math.floor(pageButtonsToShow / 2)
    );
    const endPage = Math.min(startPage + pageButtonsToShow - 1, pageCount - 1);

    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`hover:text-blue-700  border-b border-r border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:bg-gray-100 ${
            pageIndex === i ? "bg-gray-200" : ""
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i + 1}
        </button>
      );
    }
    return pageButtons;
  };
  const getPageRange = () => {
    const startItem = pageIndex * pageSize + 1;
    const endItem = Math.min(
      (pageIndex + 1) * pageSize,
      backTestCalc.data.table_items.length
    );
    return (
      <div>
        Showing{" "}
        <span className="font-extrabold text-gray-900">
          {startItem}-{endItem}
        </span>{" "}
        of{" "}
        <span className="font-extrabold text-gray-900">
          {backTestCalc.data.table_items.length}
        </span>
      </div>
    );
  };
  return (
    <>
      <h1 className="mb-2 ml-3 mt-7 text-base font-extrabold">Trades:</h1>
      <div className="overflow-x-auto p-2">
        <table className="w-full max-w-6xl border-collapse rounded-md border border-gray-100">
          <thead>
            <tr>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="border-b bg-gray-100 px-4 py-4 text-left text-xs font-semibold uppercase text-gray-500 "
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
                  className=" border-b text-sm font-normal   text-gray-500 transition duration-300 hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-4 py-2 ${
                        cell.column.id === "symbol"
                          ? "font-medium text-gray-900"
                          : ""
                      }`}
                    >
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
        <div className="flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <div className="font-medium text-gray-500">{getPageRange()}</div>
          <div className=" inline-flex rounded-md shadow-sm">
            <button
              className="mr-5 flex items-center gap-1 rounded-lg bg-black px-3 text-sm font-normal text-white"
              onClick={handleExportExcel}
            >
              Export
              <DocumentArrowDownIcon className="h-4 w-4" />
            </button>
            <button
              className="hover:text-blue-700 rounded-s-lg border  border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
              onClick={handlePrevPage}
              disabled={pageIndex === 0}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              className="hover:text-blue-700  border-b border-r border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
              onClick={() => handlePageClick(0)}
              disabled={pageIndex === 0}
            >
              <ChevronDoubleLeftIcon className="h-4 w-4" />
            </button>
            {getPageButtons()}
            <button
              className="hover:text-blue-700  border-b border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
              onClick={() => handlePageClick(pageCount - 1)}
              disabled={pageIndex === pageCount - 1}
            >
              <ChevronDoubleRightIcon className="h-4 w-4" />
            </button>
            <button
              className="hover:text-blue-700  rounded-e-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
              onClick={handleNextPage}
              disabled={pageIndex === pageCount - 1}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
