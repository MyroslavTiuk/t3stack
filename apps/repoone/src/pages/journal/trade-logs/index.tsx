import { sub } from "date-fns";
import { type NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import OptionTransactionList from "~/components/log/OptionTransactionList";
import StockTransactionList from "~/components/log/StockTransactionList";
import { api } from "~/utils/api";
import { TableHeader } from "~/components/log/TableHeader";
import LogTableEntry from "~/components/log/LogTableEntry";

const Log: NextPage = () => {
  const [startDate, setStartDate] = React.useState<Date>(
    sub(new Date(), { days: 7 })
  );
  const [endDate, setEndDate] = React.useState<Date>(new Date());

  const [globalFilterStock, setGlobalFilterStock] = React.useState("");
  const [globalFilterOption, setGlobalFilterOption] = React.useState("");

  const { data, isLoading, refetch, isFetchedAfterMount } =
    api.transactions.getAllUserTransactions.useQuery(undefined, {
      enabled: false,
    });

  const handleExportExcel = useCallback(async () => {
    try {
      // Trigger data fetching only when the export button is clicked
      await refetch();

      // Check if data is loading or not available before proceeding
      if (isLoading || !data || !isFetchedAfterMount) {
        // You may want to handle this case, e.g., show a message to the user
        return;
      }

      // Add your export logic here (similar to the code inside the useEffect block)
      const filename = "transactions.xlsx";
      const equity = XLSX.utils.json_to_sheet(data?.equityTransaction);
      const option = XLSX.utils.json_to_sheet(data?.optionTransaction);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, equity, "Equity Transactions");
      XLSX.utils.book_append_sheet(wb, option, "Option Transactions");
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  }, [data, isFetchedAfterMount, isLoading, refetch]);

  // Use useEffect to trigger the initial data fetch when the component mounts
  useEffect(() => {
    if (!isFetchedAfterMount) {
      refetch();
    }
  }, [isFetchedAfterMount, refetch]);

  const [stocksColumns, setStocksColumns] = useState([
    { title: "Transaction", checked: true },
    { title: "Symbol", checked: true },
    { title: "Share Price", checked: true },
    { title: "Direction", checked: true },
    { title: "Shares", checked: true },
    { title: "Net Price", checked: true },
    { title: "Fees", checked: true },
    { title: "Net P&L", checked: true },
    { title: "Notes", checked: true },
  ]);
  const [optionsColumns, setOptionsColumns] = useState([
    { title: "Transaction", checked: true },
    { title: "Symbol", checked: true },
    { title: "Strike", checked: true },
    { title: "Direction", checked: true },
    { title: "Type", checked: true },
    { title: "Expiration", checked: true },
    { title: "Price", checked: true },
    { title: "Contracts", checked: true },
    { title: "Net Price", checked: true },
    { title: "Fees", checked: true },
    { title: "Net P&L", checked: true },
    { title: "Notes", checked: true },
  ]);

  return (
    <>
      <div className="flex min-h-[100vh] w-full flex-col justify-start gap-4 bg-gray-100 p-4">
        <TableHeader
          title="Trade Log"
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <LogTableEntry
          title="Stocks"
          columns={stocksColumns}
          onFilterChange={(input) => setGlobalFilterStock(input)}
          onExport={handleExportExcel}
          filter={globalFilterStock}
          setColumn={(col) => {
            setStocksColumns((prev) => {
              return prev.map((v) => {
                if (v.title == col) {
                  return { title: v.title, checked: !v.checked };
                }
                return v;
              });
            });
          }}
        >
          <StockTransactionList
            startDate={startDate}
            endDate={endDate}
            filter={globalFilterStock}
            setGlobalFilter={(input) => setGlobalFilterStock(input)}
            selectedColumns={stocksColumns
              .filter((v) => v.checked)
              .map((v) => v.title)}
            showDelete
          />
        </LogTableEntry>
        <LogTableEntry
          title="Options"
          columns={optionsColumns}
          onExport={handleExportExcel}
          onFilterChange={(input) => setGlobalFilterOption(input)}
          filter={globalFilterOption}
          setColumn={(col) => {
            setOptionsColumns((prev) => {
              return prev.map((v) => {
                if (v.title == col) {
                  return { title: v.title, checked: !v.checked };
                }
                return v;
              });
            });
          }}
        >
          <OptionTransactionList
            startDate={startDate}
            endDate={endDate}
            filter={globalFilterOption}
            setGlobalFilter={(input) => setGlobalFilterOption(input)}
            selectedColumns={optionsColumns
              .filter((v) => v.checked)
              .map((v) => v.title)}
            showDelete
          />
        </LogTableEntry>
      </div>
    </>
  );
};

export default Log;
