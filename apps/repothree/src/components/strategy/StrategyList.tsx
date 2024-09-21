import React from "react";
import { api } from "~/utils/api";
import ErrorMessage from "../atoms/ErrorMessage";
import StrategyCard from "../atoms/StrategyCard";

const StrategyList: React.FC = () => {
  // @ts-ignore
  const { data, isLoading, isError } = api.strategies.getStrategies.useQuery();
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
  if (isError)
    return (
      <ErrorMessage>
        Error loading strategies, try refreshing the page.
      </ErrorMessage>
    );

  if (!data || data.strategies.length === 0) {
    return (
      <p className="text-neutral-700">No strategies found. Create some!</p>
    );
  }

  return (
    <div className="flex max-w-md flex-col gap-4">
      {data.strategies.map((strategy, idx) => (
        // @ts-ignore
        <StrategyCard strategy={strategy} key={idx} />
      ))}
    </div>
  );
};
export default StrategyList;
