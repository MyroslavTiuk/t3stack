import React from "react";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import ErrorMessage from "~/components/atoms/ErrorMessage";
import {
  type OptionTransactionInput,
  optionTransactionInputSchema,
  type EquityTransactionInput,
} from "~/server/strategies/transaction";
import { OptionAction, OptionType, Position } from "opcalc-database";
import { nextFriday } from "date-fns";
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";
import { SymbolAutocomplete } from "~/components/molecules/SymbolAutocomplete";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import AddLeg from "./addLeg";
import { formatDefaultDate } from "~/utils/format";

const OptionTransactionForm: React.FC<Props> = ({
  remove,
  addOptionLeg,
  addEquityLeg,
  initialState,
}) => {
  const { register, handleSubmit, formState, control, watch } =
    useForm<OptionTransactionInput>({
      resolver: zodResolver(optionTransactionInputSchema),
      defaultValues: {
        action: OptionAction.Buy,
        quantity: 1,
        fees: 0,
        ...initialState,
        transactionDate: formatDefaultDate(
          initialState.transactionDate,
          new Date(),
          "yyyy-MM-dd'T'HH:mm"
        ),
        expirationDate: formatDefaultDate(
          initialState.expirationDate,
          nextFriday(new Date()),
          "yyyy-MM-dd"
        ),
      },
    });

  const { mutate, isLoading, isError, error } =
    api.transactions.addOptionTransaction.useMutation();
  console.log(formState, "formState");

  const onSubmit: SubmitHandler<OptionTransactionInput> = (data) => {
    console.log(data, "data");

    mutate(data, {
      onSuccess: () => {
        remove();
        void utils.transactions.getOptionTransactions.invalidate();
        toast.success("saved trade", toastProps);
      },
    });
  };
  const utils = api.useContext();

  const currentState = watch();

  // TODO: based on expiry date: if in past offer expiry/ assignment

  const actions = [
    {
      label: "Add closing trade",
      onClick: addOptionLeg({
        ...currentState,
        action:
          currentState.action === OptionAction.Buy
            ? OptionAction.Sell
            : OptionAction.Buy,
      }),
    },
    { label: "Add option leg", onClick: addOptionLeg(currentState) },
    {
      label: "Add stock leg",
      onClick: addEquityLeg({
        symbol: currentState.underlyingSymbol,
        transactionDate: currentState.transactionDate,
        sharePrice: undefined,
        quantity: currentState.quantity * 100,
        position: Position.Long,
        openClose: currentState.openClose,
        fees: 0,
        description: currentState.description,
      }),
    },
    { label: "Discard", onClick: remove },
  ];

  return (
    <div className="relative max-w-fit">
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto">
        <div className="flex gap-1 text-sm">
          <div className="flex flex-col gap-1">
            <label htmlFor="transactionDate" className="text-neutral-700">
              Trade Date
            </label>
            <input
              id="transactionDate"
              type="datetime-local"
              className="rounded-md"
              {...register("transactionDate", { valueAsDate: true })}
            />
            <p className="text-xs text-red-800">
              {formState.errors.transactionDate &&
                "Transaction date is required"}
            </p>
          </div>
          <div className="flex w-20 flex-col gap-1">
            <label htmlFor="underlyingSymbol" className="text-neutral-700">
              Ticker
            </label>
            <Controller
              control={control}
              name="underlyingSymbol"
              render={({ field }) => (
                <SymbolAutocomplete
                  value={field.value ?? ""}
                  onChange={(symbol) => field.onChange(symbol)}
                />
              )}
            />
            <p className="text-xs text-red-800">
              {formState.errors.underlyingSymbol && "Stock ticker is required"}
            </p>
          </div>
          <div className="flex w-24 flex-col gap-1">
            <label htmlFor="action" className="text-neutral-700">
              Direction
            </label>
            <select id="action" className="rounded-md" {...register("action")}>
              <option value={OptionAction.Buy}>Buy</option>
              <option value={OptionAction.Sell}>Sell</option>
              <option value={OptionAction.Expire}>Expired</option>
              <option value={OptionAction.Assign}>Assigned</option>
            </select>
            <p className="text-xs text-red-800">
              {formState.errors.action && "Direction is required"}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="optionType" className="text-neutral-700">
              Option
            </label>
            <select
              id="optionType"
              className="rounded-md"
              {...register("optionType")}
            >
              <option value={OptionType.Call}>Call</option>
              <option value={OptionType.Put}>Put</option>
            </select>
            <p className="text-xs text-red-800">
              {formState.errors.optionType && "Option Type is required"}
            </p>
          </div>
          <div className="flex w-24 flex-col gap-1">
            <label htmlFor="strike" className="text-neutral-700">
              Strike
            </label>
            <input
              id="strike"
              type="number"
              placeholder="100.00"
              className="rounded-md"
              {...register("strikePrice", { valueAsNumber: true })}
            />
            <p className="text-xs text-red-800">
              {formState.errors.strikePrice && "Strike price is required"}
            </p>
          </div>
          <div className="flex w-24 flex-col gap-1">
            <label htmlFor="optionPrice" className="text-neutral-700">
              Option Price
            </label>
            <input
              id="optionPrice"
              type="number"
              step="0.01"
              placeholder="100.00"
              className="rounded-md"
              {...register("optionPrice", { valueAsNumber: true })}
            />
            <p className="text-xs text-red-800">
              {formState.errors.optionPrice && "Price is required"}
            </p>
          </div>
          <div className="flex w-20 flex-col gap-1">
            <label htmlFor="quantity" className="text-neutral-700">
              # Contracts
            </label>
            <input
              id="quantity"
              type="number"
              className="rounded-md"
              {...register("quantity", { valueAsNumber: true })}
            />
            <p className="text-xs text-red-800">
              {formState.errors.quantity && "Quantity is required"}
            </p>
          </div>
          <div className="flex w-20 flex-col gap-1">
            <label htmlFor="fee" className="text-neutral-700">
              Total Fees
            </label>
            <input
              id="fee"
              type="number"
              placeholder="10.00"
              step="0.01"
              className="rounded-md"
              {...register("fees", { valueAsNumber: true })}
            />
            <p className="text-xs text-red-800">
              {formState.errors.fees && "Fee is required"}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="expirationDate" className="text-neutral-700">
              Expiry
            </label>
            <input
              id="expirationDate"
              type="date"
              className="rounded-md"
              {...register("expirationDate", { valueAsDate: true })}
            />
            <p className="text-xs text-red-800">
              {formState.errors.expirationDate && "Expiration Date is required"}
            </p>
          </div>
          <div className="flex w-32 flex-col gap-1">
            <label htmlFor="description" className="text-neutral-700">
              Notes
            </label>
            <input
              id="description"
              type="text"
              className="rounded-md"
              {...register("description")}
            />
            <p className="text-xs text-red-800">
              {formState.errors.description && "Invalid description"}
            </p>
          </div>
          <button
            className="mt-6 flex h-11 items-center gap-2 rounded-lg bg-blue px-3 py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-blue/70 disabled:cursor-not-allowed disabled:bg-blue/50 md:px-2"
            type="submit"
          >
            <CloudArrowUpIcon className="h-5 w-5" />
            {isLoading ? "Saving..." : "Save"}
          </button>
          <AddLeg actions={actions} />
        </div>
      </form>
      {isError && (
        <ErrorMessage>
          Failed to save trade, try again! Error: {error.message}
        </ErrorMessage>
      )}
    </div>
  );
};

type Props = {
  initialState: Partial<OptionTransactionInput>;
  remove: () => void;
  addOptionLeg: (initialState: Partial<OptionTransactionInput>) => () => void;
  addEquityLeg: (initialState: Partial<EquityTransactionInput>) => () => void;
};

export default OptionTransactionForm;
