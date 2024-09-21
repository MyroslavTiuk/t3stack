import { Card } from "flowbite-react";
import DropdownComponent from "./Dropdown";
import { HiDownload } from "react-icons/hi";
import DatePickerComponent from "./DatePicker";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import LineChart from "../charts/lineChart";
import { tanstackTableToPrismaSorting } from "~/utils/format";

import { type SortingState } from "@tanstack/react-table";

const CardComponent: React.FC<Props> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  endDatFormat,
  startDateFormat,
  filters,
}) => {
  const { data, isLoading } = api.analytics.getWinLoss.useQuery();

  const [pageIdx] = useState(0);
  const [transactions, setTransactions] = useState<any>(0);
  // const [setTotalPL] = useState<any>(0);
  const [sorting] = useState<SortingState>([{ id: "startDate", desc: true }]);
  const [mergedData, setMergedData] = useState<any>([]);
  const [stragetiesData, setStragetiesData] = useState<any>([]);
  const { data: optionsData, isLoading: optionsLoading } =
    api.transactions.getOptionTransactions.useInfiniteQuery(
      { startDate: startDateFormat, endDate: endDatFormat },
      {
        getNextPageParam: (lastPage: any) =>
          lastPage.hasNextPage ? pageIdx + 1 : undefined,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const { data: stockData } =
    api.transactions.getEquityTransactions.useInfiniteQuery(
      { startDate: startDateFormat, endDate: endDatFormat },
      {
        getNextPageParam: (lastPage: any) =>
          lastPage.hasNextPage ? pageIdx + 1 : undefined,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );
  const { data: strageties } = api.strategies.getStrategies.useInfiniteQuery(
    { ...filters, sorting: tanstackTableToPrismaSorting(sorting) },
    {
      getNextPageParam: (lastPage: any) =>
        lastPage.hasNextPage ? pageIdx + 1 : undefined,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  useEffect(() => {
    setMergedData([
      ...(stockData?.pages[pageIdx]?.trades || []),
      ...(optionsData?.pages[pageIdx]?.trades || []),
    ]);

    setTransactions(
      (stockData?.pages[pageIdx]?.count || 0) +
        (optionsData?.pages[pageIdx]?.count || 0)
    );

    setStragetiesData([...(strageties?.pages[pageIdx]?.strategies || [])]);
    // setTotalPL([strageties?.pages[pageIdx]?.count || 0]);
  }, [startDate, endDate]);

  return (
    <div className="flex w-full max-w-7xl items-center">
      <Card href="#" className="mx-4">
        <div className="flex items-center justify-between">
          <h5 className="mb-5 mt-2 text-2xl font-bold">Dashboard</h5>

          <div className="flex items-center gap-2">
            <DatePickerComponent
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
            <DropdownComponent
              icon={<HiDownload className="mr-2 h-5 w-5" />}
              bgColor="dark"
              textColor="white"
              text="Import Trades"
            />
          </div>
        </div>
        <div className="my-1 border-t"></div>
        <div
          className={`flex flex-row ${
            window.innerWidth < 500 ? "flex-col" : "flex-row"
          } gap-2`}
        >
          <LineChart
            title="Total P&L"
            className="h-full border-r border-gray-300"
            data={stragetiesData}
            // numberOfTrades={totalPL}
            isLoading={optionsLoading}
          />
          <LineChart
            title="Number of trades"
            className="h-full border-r border-gray-300"
            data={mergedData}
            numberOfTrades={transactions}
            isLoading={optionsLoading}
          />
          <LineChart title="Win ratio" data={data} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  );
};
type Props = {
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  endDate: Date;
  setEndDate: React.Dispatch<React.SetStateAction<Date>>;
  setToCustom?: boolean;
  endDatFormat?: any;
  startDateFormat?: any;
  filters?: any;
};

export default CardComponent;
