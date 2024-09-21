import { sub } from "date-fns";
import { type NextPage } from "next";
import { TradingStrategy } from "../../../../../../packages/opcalc-database";
import React, { useState } from "react";
import { Status } from "~/components/strategies/filters";
import StrategyList from "~/components/strategies/strategyList";
import LogTableEntry from "~/components/log/LogTableEntry";
import { TableHeader } from "~/components/log/TableHeader";

const Log: NextPage = () => {
  const [startDate, setStartDate] = React.useState<Date>(
    sub(new Date(), { days: 7 })
  );
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [tradingStrategies] = React.useState<TradingStrategy[]>(
    Object.values(TradingStrategy)
  );
  const [status] = React.useState<Status[]>(Object.values(Status));

  const [columns, setColumns] = useState([
    { title: "Strategy", checked: true },
    { title: "Symbol", checked: true },
    { title: "Opened", checked: true },
    { title: "Closed", checked: true },
    { title: "Entry Price", checked: true },
    { title: "Current Price", checked: true },
    { title: "Quantity", checked: true },
    { title: "Status", checked: true },
    { title: "Net P&L", checked: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  return (
    <>
      <div className="flex min-h-[100vh] w-full flex-col justify-start gap-4 bg-gray-100 p-4">
        <TableHeader
          title="Strategies"
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <LogTableEntry
          columns={columns}
          setColumn={(col) => {
            setColumns((prev) => {
              return prev.map((v) => {
                if (v.title == col) {
                  return { title: v.title, checked: !v.checked };
                }
                return v;
              });
            });
          }}
          filter={globalFilter}
          onFilterChange={(input) => setGlobalFilter(input)}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onExport={() => {}}
        >
          <StrategyList
            filters={{
              startDate,
              endDate,
              tradingStrategies,
              status,
              symbol: globalFilter == "" ? undefined : globalFilter,
            }}
            selectedColumns={columns
              .filter((c) => c.checked)
              .map((c) => c.title)}
            showDelete
          />
        </LogTableEntry>
      </div>
    </>
  );
};

export default Log;
