import { api } from "~/utils/api";
import ErrorMessage from "../atoms/ErrorMessage";
import { type Status } from "../strategies/filters";
import { type TradingStrategy } from "trackgreeks-database";
import { type SortingState } from "@tanstack/react-table";
import { tanstackTableToPrismaSorting } from "~/utils/format";
import { useState } from "react";

const OpenPosition: React.FC<Props> = ({ filters }) => {
  // const [pageIdx, setPageIdx] = useState(0);
  const [sorting] = useState<SortingState>([{ id: "startDate", desc: true }]);

  const { data, isLoading, error } = api.strategies.getStrategies.useQuery({
    ...filters,
    sorting: tanstackTableToPrismaSorting(sorting),
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
        Error loading strategies, try refreshing the page.
      </ErrorMessage>
    );

  if (!data || data.strategies.length === 0)
    return (
      <p className="text-neutral-700">
        No strategies in this time range, start trading and then import your
        trades.
      </p>
    );

  return (
    data && (
      <div className="flex flex-col">
        <h4 className="mb-4 text-2xl font-bold leading-none text-gray-900 dark:text-white">
          Open Positions
        </h4>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <p className="mb-1 text-lg font-bold leading-none text-gray-900 dark:text-white">
              Options
            </p>
            {data.strategies
              .filter((s) => s.optionTransactions.length !== 0)
              .filter((_, i) => i < 5)
              .sort((a, b) => b.currentValue - a.currentValue)
              .map((item) => {
                const { id, tickers, quantity, currentValue, profit, status } =
                  item;
                const profitColor =
                  profit < 0 ? "text-red-600" : "text-green-600";
                return (
                  status === "Open" && (
                    <li key={id} className="py-1 sm:py-2">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="min-w-0 justify-start">
                          <p className="truncate text-base font-semibold text-gray-900 dark:text-white">
                            {tickers}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {quantity} Shares/Contracts
                          </p>
                        </div>
                        <div className="flex-col text-end">
                          <p className="truncate text-base font-semibold text-gray-900 dark:text-white">
                            ${currentValue.toFixed(2)}
                          </p>
                          <p className={`truncate text-xs ${profitColor}`}>
                            ${profit.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                );
              })}
          </ul>
        </div>

        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <p className="mb-1 text-lg font-bold leading-none text-gray-900 dark:text-white">
              Equities
            </p>
            {data.strategies
              .filter((s) => s.equityTransactions.length !== 0)
              .filter((_, i) => i < 5)
              .sort((a, b) => b.currentValue - a.currentValue)
              .map((item) => {
                const { id, tickers, quantity, currentValue, profit, status } =
                  item;
                const profitColor =
                  profit < 0 ? "text-red-600" : "text-green-600";
                return (
                  status === "Open" && (
                    <li key={id} className="py-1 sm:py-2">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="min-w-0 justify-start">
                          <p className="truncate text-base font-semibold text-gray-900 dark:text-white">
                            {tickers}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {quantity} Shares/Contracts
                          </p>
                        </div>
                        <div className="flex-col text-end">
                          <p className="truncate text-base font-semibold text-gray-900 dark:text-white">
                            ${currentValue.toFixed(2)}
                          </p>
                          <p className={`truncate text-xs ${profitColor}`}>
                            ${profit.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                );
              })}
          </ul>
        </div>
      </div>
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
};

export default OpenPosition;
