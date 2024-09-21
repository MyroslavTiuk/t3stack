import { api } from "~/utils/api";
import React from "react";
import ErrorMessage from "../atoms/ErrorMessage";
import { formatDate } from "~/utils/format";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";
import Card from "../atoms/card";
import { tradingStrategyFriendlyNames } from "./data";
import StockTransactionTable from "../log/StockTransactionTable";
import OptionTransactionTable from "../log/OptionTransactionTable";
import { StrategyStatus } from "~/server/strategies/strategies";
import { includes, sortBy } from "lodash";
import { TradingStrategy } from "trackgreeks-database";
import EditStrategy from "./edit/editStrategy";
import PLChart from "~/components/log/PLChart";
// @ts-ignore

const Strategy: React.FC<Props> = ({ strategyId }) => {
  const { data, error, isLoading } = api.strategies.getStrategy.useQuery({
    id: strategyId,
  });

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex w-full animate-pulse flex-col items-center"
      >
        {[...Array(4).keys()].map((number) => (
          <div
            key={number}
            className="mt-2 h-20 w-full rounded-lg bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage>
        Error loading strategy, try refreshing the page.
      </ErrorMessage>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <p className="text-neutral-700">Trading strategy not found.</p>
      </div>
    );
  }
  const {
    tickers,
    profit,
    price,
    currentValue,
    startDate,
    endDate,
    tradingStrategy,
    status,
    equityTransactions,
    optionTransactions,
    description,
    profitHistory,
  } = data;

  return (
    <div className="flex w-full justify-center">
      <div className="my-4 flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-neutral-700">
            {tickers.join(", ")}
          </p>
          <p className="text-neutral-500">
            {startDate ? formatDate(startDate) : ""} -{" "}
            {endDate ? formatDate(endDate) : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {profit >= 0 ? (
            <ArrowTrendingUpIcon className="h-6 w-6 text-teal-600" />
          ) : (
            <ArrowTrendingDownIcon className="h-6 w-6 text-red-400" />
          )}
          <p className="font-extrabold text-neutral-700">
            ${profit.toFixed(2)}
          </p>
          {status === StrategyStatus.Open && (
            <>
              <p className="text-neutral-500">price: {price.toFixed(2)}</p>
              <p className="text-neutral-500">
                currentValue: {currentValue.toFixed(2)}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="rounded-md px-1 outline outline-1">
            {tradingStrategyFriendlyNames[tradingStrategy]}
          </p>
          <p className="rounded-md px-1 outline outline-1">{status}</p>
          {description && (
            <p className="rounded-md px-1 outline outline-1">{description}</p>
          )}
        </div>
        <Card>
          <p className="mt-5 text-xl font-bold">Profit/Loss</p>
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <PLChart entries={profitHistory} />
        </Card>

        {equityTransactions.length > 0 && (
          <Card>
            <p className="mt-5 text-xl font-bold">Stock Transactions</p>
            <StockTransactionTable
              stockTransactions={sortBy(equityTransactions, "transactionDate")}
            />
          </Card>
        )}
        {optionTransactions.length > 0 && (
          <Card>
            <p className="text-xl font-bold">Option Transactions</p>
            <OptionTransactionTable
              optionTransactions={sortBy(optionTransactions, "transactionDate")}
            />
          </Card>
        )}
        {!includes(
          [
            TradingStrategy.BuyAndHold,
            TradingStrategy.BuyAndSell,
            TradingStrategy.ShortAndHold,
            TradingStrategy.ShortAndBuy,
          ],
          tradingStrategy
        ) && (
          <EditStrategy
            id={data.id}
            strategyInput={{
              tradingStrategy,
              optionTransactionIds: optionTransactions.map((t) => t.id),
              equityTransactionIds: equityTransactions.map((t) => t.id),
              description: description ?? undefined,
            }}
          />
        )}
      </div>
    </div>
  );
};

type Props = {
  strategyId: string;
};

export default Strategy;
