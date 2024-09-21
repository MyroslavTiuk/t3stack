import React from "react";
import { api } from "~/utils/api";
import PaginationButtons from "../atoms/PaginationButtons";
import ErrorMessage from "../atoms/ErrorMessage";
import { tradePageSize } from "~/server/strategies/transaction";
import StockTransactionTable from "./StockTransactionTable";

const StockTransactionList: React.FC<Props> = ({
  startDate,
  endDate,
  onClick,
  selectedIds,
  showDelete,
  selectedColumns,
  filter,
  setGlobalFilter,
}) => {
  const [pageIdx, setPageIdx] = React.useState(0);
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    api.transactions.getEquityTransactions.useInfiniteQuery(
      { symbol: filter, startDate, endDate },
      {
        getNextPageParam: (lastPage: { hasNextPage: any }) =>
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
        Error loading trades, try refreshing the page.
      </ErrorMessage>
    );

  if (!data || data.pages[0].trades.length === 0)
    return (
      <p className="mx-auto my-4 text-center text-neutral-700">
        No trades in this time range, start trading and then import your trades.
      </p>
    );

  return (
    data.pages[pageIdx] && (
      <>
        <StockTransactionTable
          stockTransactions={data.pages[pageIdx].trades}
          onClick={onClick}
          filter={filter}
          setGlobalFilter={setGlobalFilter}
          selectedIds={selectedIds}
          showDelete={showDelete}
          selectedColumns={selectedColumns}
        />
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <p className="text-sm text-gray-700">
            Showing{" "}
            <b>
              {pageIdx * tradePageSize + 1}
              {"-"}
              {pageIdx * tradePageSize + data.pages[pageIdx].trades.length}{" "}
            </b>{" "}
            of <b>{data.pages[pageIdx].count}</b>
          </p>
          <PaginationButtons
            setNextPage={setNextPage}
            setPrevPage={setPrevPage}
            pageIdx={pageIdx}
            lastPageIdx={Math.floor(data.pages[0].count / 10)}
            hasNextPage={data.pages[pageIdx].hasNextPage}
          />
        </div>
      </>
    )
  );
};

type Props = {
  startDate: Date;
  endDate: Date;
  onClick?: (transactionId: string) => void;
  selectedIds?: string[];
  showDelete?: boolean;
  selectedColumns?: string[];
  filter: string;
  setGlobalFilter: (input: string) => void;
};

export default StockTransactionList;
