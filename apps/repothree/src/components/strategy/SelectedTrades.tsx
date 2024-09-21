import React from "react";
import { api } from "~/utils/api";

const SelectedTrades: React.FC<Props> = ({ selectedTradeIds }) => {
  // @ts-ignore
  const { data: trades, isLoading } = api.trades.getTradeByIds.useQuery({
    ids: selectedTradeIds,
  });

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex w-full animate-pulse flex-col items-center"
      >
        {[...Array(selectedTradeIds.length).keys()].map((number) => (
          <div
            key={number}
            className="mt-2 h-4 w-32 rounded-lg bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    );
  }

  if (!trades || trades.length === 0) {
    return null;
  }

  return (
    <>
      {/*@ts-ignore*/}
      {trades.map((trade) => (
        <div key={trade.id}>
          <p className="font-bold text-neutral-700">{trade.name}</p>
        </div>
      ))}
    </>
  );
};

type Props = {
  selectedTradeIds: string[];
};

export default SelectedTrades;
