import React, { useState } from "react";
import { api } from "~/utils/api";
import PaginationButtons from "../atoms/PaginationButtons";
import ErrorMessage from "../atoms/ErrorMessage";
import { tradePageSize } from "~/server/strategies/transaction";
import StrategyTable from "./strategyTable";
import type { TradingStrategy } from "trackgreeks-database";
import { type Status } from "./filters";
import type { SortingState } from "@tanstack/react-table";
import { tanstackTableToPrismaSorting } from "~/utils/format";

const StrategyList: React.FC<Props> = ({
  filters,
  selectedColumns,
  showDelete = false,
}) => {
  const [pageIdx, setPageIdx] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "startDate", desc: true },
  ]);

  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    api.strategies.getStrategies.useInfiniteQuery(
      { ...filters, sorting: tanstackTableToPrismaSorting(sorting) },
      {
        getNextPageParam: (lastPage) =>
          lastPage.hasNextPage ? pageIdx + 1 : undefined,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  function setNextPage() {
    setPageIdx((prev) => prev + 1);
    fetchNextPage();
  }

  function setPrevPage() {
    setPageIdx((prev) => Math.max(prev - 1, 0));
  }

  if (isLoading || isFetchingNextPage)
    return (
      <div
        role="status"
        className="flex w-full animate-pulse flex-col items-center"
      >
        <div className="mt-10 h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="mt-10 h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="mt-10 h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  if (error)
    return (
      <ErrorMessage>
        Error loading strategies, try refreshing the page.
      </ErrorMessage>
    );

  if (!data || data.pages[0].strategies.length === 0)
    return (
      <p className="mx-auto my-4 text-center text-neutral-700">
        No strategies in this time range, start trading and then import your
        trades.
      </p>
    );

  return (
    data.pages[pageIdx] && (
      <>
        <StrategyTable
          strategies={data.pages[pageIdx].strategies}
          sorting={sorting}
          setSorting={setSorting}
          selectedColumns={selectedColumns}
          showDelete={showDelete}
        />
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <p className="text-sm text-gray-700">
            Showing{" "}
            <b>
              {pageIdx * tradePageSize + 1}
              {"-"}
              {pageIdx * tradePageSize +
                data.pages[pageIdx].strategies.length}{" "}
            </b>{" "}
            of <b>{data.pages[pageIdx].count}</b>
          </p>
          <PaginationButtons
            setNextPage={setNextPage}
            setPrevPage={setPrevPage}
            pageIdx={pageIdx}
            lastPageIdx={Math.ceil(data.pages[0].count / 10)}
            hasNextPage={data.pages[pageIdx].hasNextPage}
          />
        </div>
      </>
    )
  );
};

type Props = {
  filters: {
    startDate: Date;
    endDate: Date;
    tradingStrategies: TradingStrategy[];
    status: Status[];
    symbol?: string;
  };
  selectedColumns: string[];
  showDelete?: boolean;
};

export default StrategyList;
