import { TrashIcon } from "@heroicons/react/24/outline";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  OpenClose,
  OptionAction,
  type OptionTransaction,
} from "trackgreeks-database";
import { api } from "~/utils/api";

const columnHelper = createColumnHelper<OptionTransaction>();

function toExpirationDate(date: Date): string {
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return month + "/" + day + "/" + year;
}

const columns = [
  columnHelper.accessor("transactionDate", {
    cell: (info) => format(info.getValue(), "yyyy/MM/dd - kk:mm"),
    header: "Transaction",
  }),
  columnHelper.accessor("underlyingSymbol", {
    header: "Symbol",
  }),
  columnHelper.accessor("strikePrice", {
    header: "Strike",
  }),
  columnHelper.accessor("action", {
    header: "Direction",
    cell: (info) => getDirection(info.row.original),
  }),
  columnHelper.accessor("optionType", {
    header: "Type",
  }),
  columnHelper.accessor("expirationDate", {
    header: "Expiration",
    cell: (info) => toExpirationDate(info.row.original.expirationDate),
  }),
  columnHelper.accessor("netPrice", {
    id: "optionPrice",
    header: "Price",
    cell: (info) =>
      "$" +
      Math.abs(info.getValue() / info.row.original.quantity / 100).toFixed(2),
  }),
  columnHelper.accessor("quantity", {
    header: "Contracts",
  }),
  columnHelper.accessor("netPrice", {
    header: "Net Price",
    cell: (info) =>
      "$" + Math.abs(info.getValue() / info.row.original.quantity).toFixed(2),
  }),
  columnHelper.accessor("fees", {
    header: "Fees",
    cell: (info) => "$" + info.getValue().toFixed(2),
  }),
  columnHelper.accessor("netPrice", {
    id: "netpnl",
    header: "Net P&L",
    cell: (info) => "$" + info.getValue().toFixed(2),
  }),
  columnHelper.accessor("description", {
    header: "Notes",
  }),
];

function getDirection(transaction: OptionTransaction) {
  if (transaction.action === OptionAction.Buy) {
    if (transaction.openClose === OpenClose.Open) {
      return "BTO";
    }
    if (transaction.openClose === OpenClose.Close) {
      return "BTC";
    }
    return "Buy";
  }
  if (transaction.action === OptionAction.Sell) {
    if (transaction.openClose === OpenClose.Open) {
      return "STO";
    }
    if (transaction.openClose === OpenClose.Close) {
      return "STC";
    }
    return "Sell";
  }
  if (transaction.action === OptionAction.Assign) {
    return "Assigned";
  }
  return "Expired";
}

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

const OptionTransactionTable: React.FC<Props> = ({
  optionTransactions,
  onClick,
  showDelete,
  selectedColumns,
  filter,
}) => {
  const utils = api.useContext();
  const { status, mutate, variables } =
    api.transactions.deleteOptionTransaction.useMutation({
      onSuccess: () => {
        void utils.transactions.getOptionTransactions.invalidate();
      },
    });

  console.log(optionTransactions[0]);

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
  const table = useReactTable({
    data: optionTransactions,
    columns: showDelete
      ? [...columns, deleteColumn]
      : columns.filter((col) =>
          col.header ? selectedColumns?.includes(col.header.toString()) : true
        ),
    getCoreRowModel: getCoreRowModel(),
    state: {
      globalFilter: filter,
    },
  });
  return (
    <div className="overflow-x-scroll">
      <table className="w-full divide-y divide-gray-300">
        <thead className="bg-gray-100 uppercase">
          <tr>
            {table.getFlatHeaders().map((header) => (
              <th
                key={header.id}
                className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-normal text-gray-500"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} onClick={() => onClick?.(row.original.id)}>
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
  optionTransactions: OptionTransaction[];
  onClick?: (transactionId: string) => void;
  selectedIds?: string[];
  showDelete?: boolean;
  selectedColumns?: string[];
  filter?: string;
  setGlobalFilter?: (input: string) => void;
};

export default OptionTransactionTable;
