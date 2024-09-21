import React from "react";
import { api } from "~/utils/api";
import ErrorMessage from "../atoms/ErrorMessage";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { largeNumbersFormatter } from "~/utils/format";
import Card from "../atoms/card";
import { formatISO } from "date-fns";

const OverviewCards: React.FC<Props> = ({ startDate, endDate }) => {
  const { data, isLoading, error } =
    // @ts-ignore
    api.trades.getTradeCountInTimeRange.useQuery({
      startDate,
      endDate,
    });

  if (isLoading)
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

  if (!data) return <p className="text-neutral-700">No trades saved.</p>;

  const trades = data.trades;

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-4">
          <p className="text-lg font-bold text-neutral-700">
            {largeNumbersFormatter(trades._count)} Trades opened/closed
          </p>
          {trades._sum.lastProfit !== null &&
            trades._sum.lastTotalInvestment !== null &&
            trades._sum.lastTotalFees !== null && (
              <>
                <div className="flex items-end gap-3">
                  {trades._sum.lastProfit >= 0 ? (
                    <ArrowTrendingUpIcon className="h-14 w-14 text-teal-600" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-14 w-14 text-red-400" />
                  )}
                  <p className="text-5xl text-neutral-700">
                    ${largeNumbersFormatter(trades._sum.lastProfit)}
                  </p>
                  <p
                    className={
                      `${
                        trades._sum.lastProfit && trades._sum.lastProfit >= 0
                          ? "text-teal-600"
                          : "text-red-400"
                      }` + " align-bottom text-lg"
                    }
                  >
                    {(
                      trades._sum.lastProfit / trades._sum.lastTotalInvestment
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <p className="text-lg font-bold text-neutral-700">
                  ${largeNumbersFormatter(trades._sum.lastTotalFees)} fees paid
                </p>
              </>
            )}
        </div>
        <Link
          className="font-bold text-teal-600 underline"
          href={`/log?startDate=${encodeURIComponent(
            formatISO(startDate)
          )}&endDate=${encodeURIComponent(formatISO(endDate))}`}
        >
          <div className="flex items-center gap-1">
            <p>view trades in log</p>
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          </div>
        </Link>
      </div>
    </Card>
  );
};

type Props = {
  startDate: Date;
  endDate: Date;
};

export default OverviewCards;
