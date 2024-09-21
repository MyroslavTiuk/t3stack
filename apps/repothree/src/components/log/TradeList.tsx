import React from "react";
import { api } from "~/utils/api";
import PaginationButtons from "../atoms/PaginationButtons";
import ErrorMessage from "../atoms/ErrorMessage";
import TradeOverviewCard from "../atoms/TradeOverviewCard";
// @ts-ignore
import { type Trade, type AssetType } from "trackgreeks-database";
import Link from "next/link";

const tradePageSize = 10;

const TradeList: React.FC<Props> = ({
  assetType,
  startDate,
  endDate,
  symbol,
  onSelect,
}) => {
  const [pageIdx, setPageIdx] = React.useState(0);
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    // @ts-ignore
    api.trades.getTrades.useInfiniteQuery(
      { assetType, startDate, endDate, symbol },
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
      <p className="text-neutral-700">
        No trades in this time range, start trading and then import your trades{" "}
        <Link href="/" className="underline">
          here
        </Link>
        .
      </p>
    );

  return (
    <>
      <div className="flex flex-col gap-4">
        {/*@ts-ignore*/}
        {data.pages[pageIdx].trades.map((trade, idx) => (
          <TradeOverviewCard
            trade={trade}
            key={idx}
            href={`/log/${trade.id}`}
            assetType={assetType}
            onSelect={onSelect}
          />
        ))}
      </div>
      <p className="my-2 text-right text-sm text-gray-700">
        Showing trades {pageIdx * tradePageSize + 1} to{" "}
        {pageIdx * tradePageSize + data.pages[pageIdx].trades.length} of{" "}
        {data.pages[pageIdx].count}
      </p>
      {/*@ts-ignore*/}
      <PaginationButtons
        setNextPage={setNextPage}
        setPrevPage={setPrevPage}
        pageIdx={pageIdx}
        hasNextPage={data.pages[pageIdx].hasNextPage}
      />
    </>
  );
};

type Props = {
  assetType: AssetType;
  startDate: Date;
  endDate: Date;
  symbol?: string;
  onSelect?: (trade: Trade) => void;
};

export default TradeList;
