import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Position } from "trackgreeks-database";
import { format } from "date-fns";
// @ts-ignore

const columnHelper = createColumnHelper<any>();

const columnsTrade = [
  columnHelper.accessor("transaction.date", {
    cell: (info) => format(info.getValue(), "yyyy/MM/dd - kk:mm"),
    header: "date",
  }),
  columnHelper.accessor("transaction.position", {
    cell: (info) => getAction(info.row.original.transaction),
    header: "type",
  }),
  columnHelper.accessor("transaction.netPrice", {
    cell: (info) => "$" + info.getValue().toFixed(2),
    header: "net price",
  }),
  columnHelper.accessor("totalShareCount", {
    header: (info) =>
      info.table.getRowModel().rows[0].original.transaction.assetType ===
      // @ts-ignore
      AssetType.Equity
        ? "# shares"
        : "# contracts",
  }),
  columnHelper.accessor("transaction.netPrice", {
    id: "pricePerShare",
    cell: (info) =>
      "$" +
      (
        info.getValue() /
        info.row.original.transaction.quantity /
        // @ts-ignore
        (info.row.original.transaction.assetType === AssetType.Option ? 100 : 1)
      ).toFixed(2),
    header: (info) =>
      info.table.getRowModel().rows[0].original.transaction.assetType ===
      // @ts-ignore
      AssetType.Equity
        ? "share price"
        : "option price",
  }),
];

// @ts-ignore
function getAction(transaction: Transaction) {
  if (transaction.position === Position.Long) {
    return "buy " + transaction.quantity;
  }
  if (transaction.position === Position.Short) {
    return "sell " + transaction.quantity;
  }
  // @ts-ignore
  if (transaction.expiry === Expiry.Expired) {
    return "expired worthless";
  }
  // @ts-ignore
  if (transaction.expiry === Expiry.Assigned) {
    return "expired/ assigned";
  }
  return "unknown";
}

const columnsStrategy = [
  columnHelper.accessor("transaction.date", {
    cell: (info) => format(info.getValue(), "yyyy/MM/dd - kk:mm"),
    header: "date",
  }),
  columnHelper.accessor("transaction.symbol", {
    // @ts-ignore
    cell: (info) => buildTransactionName(info.row.original.transaction),
    header: "",
  }),
  columnHelper.accessor("transaction.position", {
    cell: (info) =>
      (info.getValue() === Position.Long ? "buy " : "sell ") +
      info.row.original.transaction.quantity,
    header: "",
  }),
  columnHelper.accessor("transaction.netPrice", {
    cell: (info) => "$" + info.getValue().toFixed(2),
    header: "net price",
  }),
  columnHelper.accessor("totalShareCount", {
    header: "# contracts",
  }),
  columnHelper.accessor("profit", {
    cell: (info) => "$" + info.getValue().toFixed(2),
    header: "P/L $",
  }),
];

const TransactionTable: React.FC<Props> = ({ entries, isStrategy }) => {
  const table = useReactTable({
    data: entries,
    columns: isStrategy ? columnsStrategy : columnsTrade,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        <tr>
          {table.getFlatHeaders().map((header) => (
            <th key={header.id} className="px-2">
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
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="p-4 text-right">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

type Props = {
  entries: any[];
  isStrategy?: boolean;
};

export default TransactionTable;
