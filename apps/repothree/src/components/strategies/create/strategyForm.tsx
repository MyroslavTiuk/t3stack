import React from "react";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import ErrorMessage from "~/components/atoms/ErrorMessage";
import { TradingStrategy } from "trackgreeks-database";
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  type StrategyInput,
  strategyInputSchema,
} from "~/server/strategies/strategies";
import Card from "~/components/atoms/card";
import { tradingStrategyFriendlyNames } from "../data";
import OptionTransactions from "./optionTransactions";
import EquityTransactions from "./equityTransactions";

const StrategyForm: React.FC<Props> = ({ onCancel, initialState, id }) => {
  const { register, handleSubmit, control } = useForm<StrategyInput>({
    resolver: zodResolver(strategyInputSchema),
    defaultValues: initialState ?? {
      optionTransactionIds: [],
      equityTransactionIds: [],
    },
  });

  const { mutate, isLoading, isError, error } =
    api.strategies.createStrategy.useMutation();

  const onSubmit: SubmitHandler<StrategyInput> = (data) => {
    mutate(
      { ...data, id },
      {
        onSuccess: () => {
          void utils.strategies.getStrategies.invalidate();
          void utils.strategies.getStrategy.invalidate();
          toast.success("saved strategy", toastProps);
          onCancel();
        },
      }
    );
  };
  const utils = api.useContext();

  return (
    <Card className="mt-3">
      <h2 className="text-lg font-semibold text-neutral-700">
        {id ? "Edit" : "New"} Strategy
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto">
        <input
          id="description"
          type="text"
          className="mt-3 rounded-md"
          placeholder="Description (optional)"
          {...register("description")}
        />
        <select
          id="tradingStrategy"
          className="ml-4 rounded-md"
          defaultValue={TradingStrategy.Custom}
          {...register("tradingStrategy")}
        >
          {Object.values(TradingStrategy).map((strategy) => (
            <option key={strategy} value={strategy}>
              {tradingStrategyFriendlyNames[strategy]}
            </option>
          ))}
        </select>

        <p className="mt-4 font-semibold text-neutral-700">Option Trades</p>
        <Controller
          control={control}
          name="optionTransactionIds"
          render={({ field }) => (
            <OptionTransactions
              transactionIds={field.value}
              addTransactionId={(id) => field.onChange([...field.value, id])}
              removeTransactionId={(id) =>
                field.onChange(field.value.filter((v) => v !== id))
              }
            />
          )}
        />
        <p className="mt-4 font-semibold text-neutral-700">Stock Trades</p>
        <Controller
          control={control}
          name="equityTransactionIds"
          render={({ field }) => (
            <EquityTransactions
              transactionIds={field.value}
              addTransactionId={(id) => field.onChange([...field.value, id])}
              removeTransactionId={(id) =>
                field.onChange(field.value.filter((v) => v !== id))
              }
            />
          )}
        />
        <div className="flex w-full justify-end gap-4">
          <button
            className="flex w-40 items-center justify-center rounded-lg border-2 border-orange py-2 font-semibold text-orange no-underline drop-shadow transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10"
            onClick={onCancel}
          >
            <XMarkIcon className="h-6 w-6" />
            <span>Cancel</span>
          </button>
          <button
            className="flex w-40 items-center justify-center gap-2 rounded-lg bg-blue  py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-blue/70 "
            type="submit"
          >
            <CloudArrowUpIcon className="h-6 w-6" />
            <span> {isLoading ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </form>
      {isError && (
        <ErrorMessage>
          Failed to save strategy, try again! Error: {error.message}
        </ErrorMessage>
      )}
    </Card>
  );
};

type Props = {
  onCancel: () => void;
  id?: string;
  initialState?: StrategyInput;
};

export default StrategyForm;
