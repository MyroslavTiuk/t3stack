import React from "react";
import Card from "./card";
import { type Strategy } from "trackgreeks-database";
import { api } from "~/utils/api";
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const StrategyCard: React.FC<Props> = ({ strategy }) => {
  const { mutate } = api.strategies.deleteStrategy.useMutation();

  function onDelete() {
    mutate(
      { id: strategy.id },
      {
        onSuccess: () => {
          void utils.strategies.invalidate();
        },
      }
    );
  }

  const utils = api.useContext();
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          {/*@ts-ignore*/}
          <p className="text-xl font-bold text-neutral-700">{strategy.name}</p>
          <button onClick={onDelete}>
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>
        {/*@ts-ignore*/}
        {strategy.trades.map((trade) => (
          <div key={trade.id} className="flex items-center justify-between">
            {trade.name}
          </div>
        ))}
        <Link
          className="font-bold text-teal-600 underline"
          href={`/strategy/${strategy.id}`}
        >
          <div className="flex items-center gap-1">
            <p>view trades</p>
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          </div>
        </Link>
      </div>
    </Card>
  );
};

type Props = {
  strategy: Strategy & any[];
};
export default StrategyCard;
