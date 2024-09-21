import React from "react";
import { TradingStrategy } from "trackgreeks-database";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { api } from "~/utils/api";
import ErrorMessage from "../atoms/ErrorMessage";
import { tradingStrategyFriendlyNames } from "./data";

const strategyInputSchema = z.object({
  name: z.string().min(1),
  tradingStrategy: z.nativeEnum(TradingStrategy),
});

type StrategyInput = z.infer<typeof strategyInputSchema>;

const StrategyForm: React.FC<Props> = ({
  selectedTradeIds,
  onClose,
  selectedTradingStrategy,
}) => {
  const { register, handleSubmit, formState } = useForm<StrategyInput>({
    resolver: zodResolver(strategyInputSchema),
  });
  const { mutate, isLoading, isError } =
    api.strategies.createStrategy.useMutation();

  const onSubmit: SubmitHandler<StrategyInput> = (data) => {
    mutate(
      {
        ...data,
        // @ts-ignore
        tradeIds: selectedTradeIds,
      },
      {
        onSuccess: () => {
          void utils.strategies.invalidate();
          onClose();
        },
      }
    );
  };
  const utils = api.useContext();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-neutral-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. AAPL Long Call Spread"
              className="rounded-md"
              {...register("name")}
              onKeyPress={(
                e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                e.key === "Enter" && e.preventDefault();
              }}
            />
            <p className="text-xs text-red-800">
              {formState.errors.name && "name is required"}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="assetType" className="text-neutral-700">
              Strategy
            </label>
            <select
              id="assetType"
              className="rounded-md"
              // @ts-ignore
              defaultValue={selectedTradingStrategy || TradingStrategy.custom}
              {...register("tradingStrategy")}
            >
              {Object.keys(tradingStrategyFriendlyNames).map((value) => (
                <option value={value} key={value}>
                  {
                    tradingStrategyFriendlyNames[
                      // @ts-ignore
                      value as keyof typeof tradingStrategyFriendlyNames
                    ]
                  }
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            className="flex h-10 items-center gap-2 rounded-lg border-2 border-teal-600 px-1 text-sm font-semibold text-teal-600 no-underline drop-shadow transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10 md:px-2 lg:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex h-10 items-center gap-2 rounded-lg bg-red-400 px-3 py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-red-400/70 disabled:cursor-not-allowed disabled:bg-red-400/50 md:px-2"
            type="submit"
            disabled={
              !formState.isValid ||
              formState.isSubmitting ||
              isLoading ||
              selectedTradeIds.length === 0
            }
          >
            <CloudArrowUpIcon className="h-5 w-5" />
            {isLoading ? "Saving..." : "Save strategy"}
          </button>
        </div>
      </div>
      {isError && (
        <ErrorMessage>Failed to save strategy, try again!</ErrorMessage>
      )}
    </form>
  );
};

type Props = {
  selectedTradeIds: string[];
  selectedTradingStrategy?: TradingStrategy;
  onClose: () => void;
};

export default StrategyForm;
