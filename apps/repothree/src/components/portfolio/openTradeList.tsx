// @ts-ignore
import type { AssetType } from "trackgreeks-database";
import Link from "next/link";
import React from "react";
import ErrorMessage from "~/components/atoms/ErrorMessage";
import { api } from "~/utils/api";
import TradeOverviewCard from "../atoms/TradeOverviewCard";
// @ts-ignore
import PaginationButtons from "../atoms/PaginationButtons";

const tradePageSize = 10;

const OpenTradeList: React.FC<Props> = ({ assetType, portfolioId }) => {
  const [pageIdx, setPageIdx] = React.useState(0);
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    // @ts-ignore
    api.portfolio.getPortfolio.useInfiniteQuery(
      { assetType, portfolioId },
      {
        // @ts-ignore
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

  if (isLoading || isFetchingNextPage) {
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
  }

  if (error)
    return (
      <ErrorMessage>
        {portfolioId
          ? "No portfolio found. Make sure the link is correct."
          : "Error loading portfolio, try refreshing the page."}
      </ErrorMessage>
    );

  if (!data || data.pages[0].trades.length === 0)
    return (
      <p className="text-neutral-700">
        No open trades found, start trading and import your trades{" "}
        <Link href="/" className="underline">
          here
        </Link>
        .
      </p>
    );
  return (
    <div className="flex flex-col gap-4">
      {/*@ts-ignore*/}
      {data.pages[pageIdx].trades.map((trade, idx) => (
        <TradeOverviewCard
          trade={trade}
          key={idx}
          href={portfolioId ? undefined : `/log/${trade.id}`}
          assetType={assetType}
        />
      ))}
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
    </div>
  );
};

type Props = {
  assetType: AssetType;
  portfolioId?: string;
};

export default OpenTradeList;
