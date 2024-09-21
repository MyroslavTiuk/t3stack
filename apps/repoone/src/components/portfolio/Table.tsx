import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type ChartData } from "~/components/portfolio/Card";
import { type ChartProps } from "~/components/portfolio/Chart";

const columnHelper = createColumnHelper<ChartData>();

const columns = [
  columnHelper.accessor("symbol", {
    header: "Symbol",
    cell: (info) => {
      return (
        <div className="flex items-center gap-5">
          <div
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: info.row.original.color,
            }}
          ></div>
          {info.row.original.symbol}
        </div>
      );
    },
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
  }),
];
export default function Table({ data }: ChartProps) {
  const table = useReactTable({
    data: data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-w-content h-full w-full overflow-auto">
      <table className="w-full divide-y divide-gray-300">
        <thead className="bg-gray-100 uppercase">
          <tr>
            {table.getFlatHeaders().map((header) => (
              <th
                key={header.id}
                className="w-1 whitespace-nowrap px-4 py-3.5 text-left text-sm font-normal text-gray-500 first:rounded-tl-lg first:pl-12"
              >
                <div className="flex items-center">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300 border-none">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bg-white text-gray-900">
              {row.getVisibleCells().map((cell, index) => (
                <td
                  key={cell.id}
                  className={
                    "whitespace-nowrap border-b border-gray-200 p-4 text-sm " +
                    (index == 1 ? "text-gray-500" : "text-gray-900")
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
}
