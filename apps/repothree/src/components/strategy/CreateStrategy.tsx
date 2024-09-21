import React from "react";
// @ts-ignore
import type { Trade, TradingStrategy } from "trackgreeks-database";
import StrategyForm from "~/components/strategy/StrategyForm";
import SelectedTrades from "~/components/strategy/SelectedTrades";
import Card from "~/components/atoms/card";
import AddTradeDialog from "./AddTradeDialog";
import { PlusIcon } from "@heroicons/react/24/solid";

const CreateStrategy: React.FC<Props> = ({
  onCancel,
  initialTradeIds,
  initialTradingStrategy,
}) => {
  const [selectedTradeIds, setSelectedTradeIds] =
    React.useState<string[]>(initialTradeIds);
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const onClose = () => setIsDialogOpen(false);

  return (
    <Card>
      <div className="flex w-full flex-col gap-2">
        <StrategyForm
          selectedTradeIds={selectedTradeIds}
          selectedTradingStrategy={initialTradingStrategy}
          onClose={onCancel}
        />
        <SelectedTrades selectedTradeIds={selectedTradeIds} />
        <button
          className="flex h-10 max-w-fit items-center gap-2 rounded-lg border-2 border-teal-600 px-1 text-sm font-semibold text-teal-600 no-underline drop-shadow transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10 md:px-2 lg:text-base"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusIcon className="h-6 w-6" />
          Add Trade
        </button>
        <AddTradeDialog
          isOpen={isDialogOpen}
          onClose={onClose}
          onSelect={(trade: Trade) => {
            if (!selectedTradeIds.includes(trade.id)) {
              setSelectedTradeIds((prev) => [...prev, trade.id]);
            }
          }}
        />
      </div>
    </Card>
  );
};

type Props = {
  onCancel: () => void;
  initialTradeIds: string[];
  initialTradingStrategy?: TradingStrategy;
};

export default CreateStrategy;
