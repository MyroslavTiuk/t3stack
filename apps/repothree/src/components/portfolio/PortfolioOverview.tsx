import React from "react";
import Card from "../atoms/card";
import { largeNumbersFormatter } from "~/utils/format";
import { api } from "~/utils/api";
import ErrorMessage from "../atoms/ErrorMessage";
import { every } from "lodash";

const PortfolioOverview: React.FC = () => {
  // @ts-ignore
  const { data, isLoading, error } = api.portfolio.getOverview.useQuery();
  if (isLoading)
    return (
      <div
        role="status"
        className="flex w-full animate-pulse flex-col items-center"
      >
        <div className="mt-10 h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="mt-10 h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="dark:bg-gray∏-700 mt-10 h-10 w-full rounded-lg bg-gray-200"></div>
      </div>
    );
  if (error)
    return (
      <ErrorMessage>
        Error loading portfolio, try refreshing the page.
      </ErrorMessage>
    );

  if (!data || every(data, ["count", 0]))
    return <p className="text-neutral-700">No open positions.</p>;

  return (
    <div className="flex flex-col gap-4">
      {data.map((item: any) => {
        if (item.count === 0) return null;

        return (
          <Card key={item.name}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <p className="text-lg font-bold text-neutral-700">
                    {item.name}
                  </p>
                  <div className="flex items-end gap-3">
                    <p className="text-3xl text-neutral-700 ">
                      ${largeNumbersFormatter(item.value)}
                    </p>
                    <p className="align-bottom text-lg">{item.count} stocks</p>
                  </div>
                  <p className="text-lg  text-neutral-700">
                    {item.symbols.slice(0, 3).join(", ")}
                    {item.symbols.length > 3 ? ", ..." : ""}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PortfolioOverview;
