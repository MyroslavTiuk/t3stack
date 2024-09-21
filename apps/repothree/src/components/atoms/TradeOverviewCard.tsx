import React from "react";
import Link from "next/link";
import Card from "./card";
import { sortBy } from "lodash";
import {
  ArrowTopRightOnSquareIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";
import { formatDate, largeNumbersFormatter } from "~/utils/format";

const TradeOverviewCard: React.FC<Props> = ({
  trade,
  href,
  hrefName,
  onSelect,
}) => {
  const sortedEntries = sortBy(trade.entries, "date");
  const profit = sortedEntries.at(-1)?.profit;
  const shareCount = Math.max(
    ...trade.entries.map((entry: { totalShareCount: number }) =>
      Math.abs(entry.totalShareCount)
    )
  );
  const entryPrice = sortedEntries.at(0)?.totalValue;
  if (profit === undefined || entryPrice === undefined) {
    return null;
  }
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-xl font-bold text-neutral-700">{trade.name}</p>
          <p className="text-neutral-500">
            {formatDate(trade.startDate)} -{" "}
            {trade.endDate ? formatDate(trade.endDate) : ""}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
            {profit >= 0 ? (
              <ArrowTrendingUpIcon className="h-6 w-6 text-teal-600" />
            ) : (
              <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />
            )}
            <p className="text-lg text-neutral-700">
              ${largeNumbersFormatter(profit)}
            </p>
            <p
              className={
                `${profit >= 0 ? "text-teal-600" : "text-red-400"}` +
                " align-bottom text-sm"
              }
            >
              {sortedEntries.at(-1)?.profitPercent?.toFixed(1)}%
            </p>
          </div>
          <p className="text-center">
            {largeNumbersFormatter(shareCount)} {"contracts"}
          </p>
          <p className="max-w-[33%] text-center">
            ${largeNumbersFormatter(entryPrice)} entry price
          </p>
        </div>
        {href && (
          <div className="flex gap-4">
            <p className="text-neutral-700">{trade.entryCount} transactions</p>
            <Link className="font-bold text-teal-600 underline" href={href}>
              <div className="flex items-center gap-1">
                <p>{hrefName ?? "view transactions"}</p>
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </div>
            </Link>
          </div>
        )}
        {onSelect && (
          <div className="flex w-full justify-end">
            <button
              className="flex items-center gap-2 rounded-lg bg-red-400 px-3 py-1  text-sm font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-red-400/70 hover:bg-opacity-10 md:px-2 lg:text-base"
              onClick={() => onSelect(trade)}
            >
              Select
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

type Props = {
  href?: string;
  hrefName?: string;
  trade: any;
  assetType: any;
  onSelect?: (trade: any) => void;
};

export default TradeOverviewCard;
