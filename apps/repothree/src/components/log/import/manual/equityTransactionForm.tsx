import React from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import ErrorMessage from "~/components/atoms/ErrorMessage";
import {
  equityTransactionInputSchema,
  type EquityTransactionInput,
  type OptionTransactionInput,
} from "~/server/strategies/transaction";
import { Position } from "trackgreeks-database";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";
import { SymbolAutocomplete } from "~/components/molecules/SymbolAutocomplete";
import AddLeg from "./addLeg";
// @ts-ignore
import { formatDefaultDate } from "~/utils/format";

const EquityTransactionForm: React.FC<Props> = ({
  remove,
  initialState,
  addEquityLeg,
  addOptionLeg,
}) => {
  const { register, handleSubmit, formState, control, watch } =
    useForm<EquityTransactionInput>({
      resolver: zodResolver(equityTransactionInputSchema),
      defaultValues: {
        position: Position.Long,
        quantity: 1,
        fees: 0,
        ...initialState,
        transactionDate: formatDefaultDate(
          initialState.transactionDate,
          new Date(),
          "yyyy-MM-dd'T'HH:mm"
        ),
      },
    });

  const { mutate, isLoading, isError, error } =
    api.transactions.addEquityTransaction.useMutation();
  const utils = api.useContext();
  const onSubmit: SubmitHandler<EquityTransactionInput> = (data) => {
    mutate(data, {
      onSuccess: () => {
        remove();
        void utils.transactions.invalidate();
        toast.success("saved trade", toastProps);
      },
    });
  };

  const currentState = watch();

  const actions = [
    {
      label: "Add closing trade",
      onClick: addEquityLeg({
        ...currentState,
        position:
          currentState.position === Position.Long
            ? Position.Short
            : Position.Long,
      }),
    },
    {
      label: "Add option leg",
      onClick: addOptionLeg({
        underlyingSymbol: currentState.symbol,
        transactionDate: currentState.transactionDate,
        quantity:
          (currentState.quantity ?? 0) > 100
            ? (currentState.quantity ?? 0) / 100
            : currentState.quantity ?? 0,
        openClose: currentState.openClose,
        description: currentState.description,
      }),
    },
    {
      label: "Add stock leg",
      onClick: addEquityLeg(currentState),
    },
    { label: "Discard", onClick: remove },
  ];

  return (
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
            defaultValue={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
          />
          <p className="text-xs text-red-800">
            {formState.errors.transactionDate && "Transaction date is required"}
          </p>
        </div>
        <div className="flex w-20 flex-col gap-1">
          <label htmlFor="symbol" className="text-neutral-700">
            Ticker
          </label>
          <Controller
            control={control}
            name="symbol"
            render={({ field }) => (
              <SymbolAutocomplete
                // @ts-ignore
                value={field.value ?? ""}
                onChange={(symbol) => field.onChange(symbol)}
              />
            )}
          />
          <p className="text-xs text-red-800">
            {formState.errors.symbol && "Stock ticker is required"}
          </p>
        </div>
        <div className="flex w-24 flex-col gap-1">
          <label htmlFor="action" className="text-neutral-700">
            Direction
          </label>
          <select id="action" className="rounded-md" {...register("position")}>
            <option value={Position.Long}>Long</option>
            <option value={Position.Short}>Short</option>
          </select>
          <p className="text-xs text-red-800">
            {formState.errors.position && "Position is required"}
          </p>
        </div>
        <div className="flex w-24 flex-col gap-1">
          <label htmlFor="sharePrice" className="text-neutral-700">
            Share Price
          </label>
          <input
            id="sharePrice"
            type="number"
            step="0.01"
            placeholder="100.00"
            className="rounded-md"
            {...register("sharePrice", { valueAsNumber: true })}
          />
          <p className="text-xs text-red-800">
            {formState.errors.sharePrice && "Price is required"}
          </p>
        </div>
        <div className="flex w-20 flex-col gap-1">
          <label htmlFor="quantity" className="text-neutral-700">
            # Shares
          </label>
          <input
            id="quantity"
            type="number"
            className="rounded-md"
            defaultValue={1}
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
      {isError && (
        <ErrorMessage>
          Failed to save trade, try again! Error: {error.message}
        </ErrorMessage>
      )}
    </form>
  );
};

type Props = {
  initialState: Partial<EquityTransactionInput>;
  remove: () => void;
  addOptionLeg: (initialState: Partial<OptionTransactionInput>) => () => void;
  addEquityLeg: (initialState: Partial<EquityTransactionInput>) => () => void;
};

export default EquityTransactionForm;
