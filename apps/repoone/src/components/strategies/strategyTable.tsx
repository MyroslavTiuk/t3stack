import {
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/24/outline";
import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  StrategyStatus,
  type ComputedStrategy,
} from "~/server/strategies/strategies";
import { formatDate } from "~/utils/format";
import { tradingStrategyFriendlyNames } from "./data";
import { noop } from "lodash";
import Badge from "~/components/strategies/Badge";
import React from "react";
import { api } from "~/utils/api";
import { TrashIcon } from "@heroicons/react/24/outline";

const sortableColumns = ["tradingStrategy", "startDate", "endDate"];

const columnHelper = createColumnHelper<ComputedStrategy>();

const columns = [
  columnHelper.accessor("tradingStrategy", {
    header: "Strategy",
    cell: (info) => tradingStrategyFriendlyNames[info.getValue()],
  }),
  columnHelper.accessor("tickers", {
    header: "Symbol",
    cell: (info) => info.getValue().join(", "),
  }),
  columnHelper.accessor("startDate", {
    header: "Opened",
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor("endDate", {
    header: "Closed",
    cell: (info) => {
      const value = info.getValue();
      return value ? formatDate(value) : "";
    },
  }),

  columnHelper.accessor("price", {
    header: "Entry Price",
    cell: (info) =>
      info.row.original.status === StrategyStatus.Open
        ? "$" + -info.getValue().toFixed(2)
        : "",
  }),
  columnHelper.accessor("currentValue", {
    header: "Current Price",
    cell: (info) =>
      info.row.original.status === StrategyStatus.Open
        ? "$" + info.getValue().toFixed(2)
        : "",
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: (info) => {
      const unit =
        info.row.original.optionTransactions.length > 0
          ? " Contract"
          : " Share";
      return Number.isInteger(info.getValue())
        ? info.getValue().toString() +
            unit +
            (Number(info.getValue()) > 1 ? "s" : "")
        : unit + info.getValue().toFixed(2).toString() + "s";
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const profit = info.row.original.profit;
      const status = info.row.original.status;
      if (status == "Open") {
        return <Badge title="Open" />;
      } else if (profit >= 0.01) {
        return <Badge title="Win" />;
      } else {
        return <Badge title="Loss" />;
      }
    },
  }),
  columnHelper.accessor("profit", {
    id: "netpnl",
    header: "Net P&L",
    cell: (info) => "$" + info.getValue().toFixed(2),
  }),
];

function getCellColor(header: any, value: any): string {
  if (header == "Symbol") {
    return "text-gray-900";
  } else if (header == "Net P&L") {
    if (value > 0) {
      return "text-green-600";
    } else {
      return "text-red-600";
    }
  }
  return "text-gray-500";
}

const StrategyTable: React.FC<Props> = ({
  strategies,
  sorting,
  setSorting,
  selectedColumns,
  showDelete = false,
}) => {
  const utils = api.useContext();
  const { status, mutate, variables } =
    api.strategies.deleteStrategy.useMutation({
      onSuccess: () => {
        void utils.strategies.getStrategies.invalidate();
      },
    });

  const deleteColumn = columnHelper.display({
    id: "delete",
    cell: (info) => (
      <button onClick={() => mutate({ id: info.row.original.id })}>
        {status === "loading" && variables?.id === info.row.original.id ? (
          <div
            className="aspect-square h-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          />
        ) : (
          <TrashIcon className="h-5 w-5" />
        )}
      </button>
    ),
  });
  const filteredColumns = columns.filter((col) =>
    col.header ? selectedColumns?.includes(col.header.toString()) : true
  );
  const table = useReactTable({
    data: strategies,
    columns: showDelete ? [...filteredColumns, deleteColumn] : filteredColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="min-w-content overflow-auto">
      <table className="w-full divide-y divide-gray-300">
        <thead className="bg-gray-100 uppercase">
          <tr>
            {table.getFlatHeaders().map((header) => (
              <th
                key={header.id}
                className={
                  "whitespace-nowrap px-4 py-3.5 text-left text-sm font-normal text-gray-500 " +
                  (sortableColumns.includes(header.column.id)
                    ? "cursor-pointer select-none"
                    : "cursor-auto")
                }
                onClick={
                  sortableColumns.includes(header.column.id)
                    ? header.column.getToggleSortingHandler()
                    : noop
                }
              >
                <div className="flex items-center gap-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {{
                    asc: <BarsArrowDownIcon className="h-4 w-4" />,
                    desc: <BarsArrowUpIcon className="h-4 w-4" />,
                  }[header.column.getIsSorted() as string] ?? null}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bg-white">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={
                    "whitespace-nowrap border-b border-gray-200 p-4 text-sm " +
                    getCellColor(
                      cell.column.columnDef.header,
                      cell.getContext().getValue()
                    )
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type Props = {
  strategies: ComputedStrategy[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  selectedColumns: string[];
  showDelete?: boolean;
};

export default StrategyTable;
