import React from "react";
import { FiInfo } from "react-icons/fi";

import Card from "../atoms/card";
import Tooltip from "../atoms/tooltip";

const ChartContainer: React.FC<Props> = ({
  children,
  title,
  description,
  isLoading,
  isEmpty,
}) => {
  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3">
      <Card>
        <div className="flex items-center justify-between border-b-2 pb-4">
          <h3 className="text-lg">{title}</h3>
          <Tooltip message={description}>
            <FiInfo className="h-6 w-6" />
          </Tooltip>
        </div>
        <div className="flex h-[400px] items-center justify-center">
          {isLoading && (
            <div className="mt-4 flex  w-full animate-pulse items-baseline space-x-6">
              <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-56 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-64 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-56 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-72 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-80 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-80 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {!isLoading && isEmpty && (
            <span>No data yet. Import/enter trades.</span>
          )}
          {!isLoading && !isEmpty && children}
        </div>
      </Card>
    </div>
  );
};

type Props = {
  children: React.ReactNode;
  title: string;
  description: string;
  isLoading: boolean;
  isEmpty: boolean;
};

export default ChartContainer;
