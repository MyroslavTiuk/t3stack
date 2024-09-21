import React from "react";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/solid";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import ErrorMessage from "~/components/atoms/ErrorMessage";
import {
  transactionInputSchema,
  type TransactionInput,
  // @ts-ignore
} from "~/server/trades/transaction";
import { RadioGroup } from "@headlessui/react";
import {
  BellAlertIcon,
  CurrencyDollarIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
// @ts-ignore
import { AssetType, OptionType, Position } from "trackgreeks-database";
import { format, nextFriday } from "date-fns";
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";
import { SymbolAutocomplete } from "~/components/molecules/SymbolAutocomplete";

const TransactionForm: React.FC<Props> = ({ onClose }) => {
  const { register, handleSubmit, formState, watch, control } =
    useForm<TransactionInput>({
      resolver: zodResolver(transactionInputSchema),
      defaultValues: {
        assetType: AssetType.Option,
        position: Position.Long,
        quantity: 1,
        strikePrice: 100,
        fees: 0,
        exitFees: 0,
        isClosed: false,
      },
    });

  const { mutate, isLoading, isError, error } =
    // @ts-ignore
    api.transactions.saveTransaction.useMutation();

  const onSubmit: SubmitHandler<TransactionInput> = (data) => {
    mutate(data, {
      onSuccess: () => {
        void utils.transactions.invalidate();
        // @ts-ignore
        void utils.trades.invalidate();
        toast.success("saved trade", toastProps);
        onClose();
      },
    });
  };
  const utils = api.useContext();
  const assetType = watch("assetType");
  const isClosed = watch("isClosed");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <Controller
          name="assetType"
          control={control}
          defaultValue={AssetType.Option}
          render={({ field }) => (
            <RadioGroup {...field} value={field.value}>
              <div className="mt-4 flex gap-2">
                {[
                  {
                    assetType: AssetType.Option,
                    icon: <BellAlertIcon className="h-5 w-5" />,
                  },
                  {
                    assetType: AssetType.Equity,
                    icon: <CurrencyDollarIcon className="h-5 w-5" />,
                  },
                ].map(({ assetType, icon }) => (
                  <RadioGroup.Option
                    key={assetType}
                    value={assetType}
                    className={({ active }) =>
                      `${
                        active
                          ? "border-teal-600 ring-2 ring-teal-600"
                          : "border-gray-300"
                      } relative flex w-1/2 cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none`
                    }
                  >
                    {({ checked, active }) => (
                      <div className="flex items-center gap-1">
                        {icon}
                        <RadioGroup.Label className="font-bold">
                          {assetType}
                        </RadioGroup.Label>
                        <CheckCircleIcon
                          className={`${
                            !checked ? "invisible" : ""
                          } h-5 w-5 text-teal-600`}
                          aria-hidden="true"
                        />
                        <span
                          className={`${active ? "border" : "border-2"}
                  ${checked ? "border-teal-600" : "border-transparent"} 
                  pointer-events-none absolute -inset-px rounded-lg`}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          )}
        />

        <Controller
          name="position"
          control={control}
          defaultValue={Position.Long}
          render={({ field }) => (
            <RadioGroup {...field} value={field.value}>
              <div className="flex gap-2">
                {[
                  {
                    position: Position.Long,
                    icon: <ArrowTrendingUpIcon className="h-5 w-5" />,
                  },
                  {
                    position: Position.Short,
                    icon: <ArrowTrendingDownIcon className="h-5 w-5" />,
                  },
                ].map(({ position, icon }) => (
                  <RadioGroup.Option
                    key={position}
                    value={position}
                    className={({ active }) =>
                      `${
                        active
                          ? "border-teal-600 ring-2 ring-teal-600"
                          : "border-gray-300"
                      } relative flex w-1/2 cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none`
                    }
                  >
                    {({ checked, active }) => (
                      <div className="flex items-center gap-1">
                        {icon}
                        <RadioGroup.Label className="font-bold">
                          {assetType === AssetType.Option &&
                            position === Position.Long &&
                            "Bought"}
                          {assetType === AssetType.Option &&
                            position === Position.Short &&
                            "Sold"}
                          {assetType === AssetType.Equity &&
                            position === Position.Long &&
                            "Long"}
                          {assetType === AssetType.Equity &&
                            position === Position.Short &&
                            "Short"}
                        </RadioGroup.Label>
                        <CheckCircleIcon
                          className={`${
                            !checked ? "invisible" : ""
                          } h-5 w-5 text-teal-600`}
                          aria-hidden="true"
                        />
                        <span
                          className={`${active ? "border" : "border-2"}
                  ${checked ? "border-teal-600" : "border-transparent"} 
                  pointer-events-none absolute -inset-px rounded-lg`}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          )}
        />

        {assetType === AssetType.Option && (
          <Controller
            name="optionType"
            control={control}
            defaultValue={OptionType.Call}
            render={({ field }) => (
              <RadioGroup {...field} value={field.value}>
                <div className="flex gap-2">
                  {[
                    {
                      optionType: OptionType.Call,
                      icon: <DocumentArrowUpIcon className="h-5 w-5" />,
                    },
                    {
                      optionType: OptionType.Put,
                      icon: <DocumentArrowDownIcon className="h-5 w-5" />,
                    },
                  ].map(({ optionType, icon }) => (
                    <RadioGroup.Option
                      key={optionType}
                      value={optionType}
                      className={({ active }) =>
                        `${
                          active
                            ? "border-teal-600 ring-2 ring-teal-600"
                            : "border-gray-300"
                        } relative flex w-1/2 cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none`
                      }
                    >
                      {({ checked, active }) => (
                        <div className="flex items-center gap-1">
                          {icon}
                          <RadioGroup.Label className="font-bold">
                            {optionType}
                          </RadioGroup.Label>
                          <CheckCircleIcon
                            className={`${
                              !checked ? "invisible" : ""
                            } h-5 w-5 text-teal-600`}
                            aria-hidden="true"
                          />
                          <span
                            className={`${active ? "border" : "border-2"}
                  ${checked ? "border-teal-600" : "border-transparent"} 
                  pointer-events-none absolute -inset-px rounded-lg`}
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            )}
          />
        )}

        <div className="flex gap-2">
          <div className="flex w-1/2 flex-col gap-1">
            <label htmlFor="date" className="text-neutral-700">
              Entry Date
            </label>
            <input
              id="date"
              type="datetime-local"
              className="rounded-md"
              {...register("date", { valueAsDate: true })}
              defaultValue={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            />
            <p className="text-xs text-red-800">
              {formState.errors.date && "Trade Date is required"}
            </p>
          </div>
          {assetType === AssetType.Option && (
            <div className="flex flex-col gap-1">
              <label htmlFor="expirationDate" className="text-neutral-700">
                Expiration Date
              </label>
              <input
                id="expirationDate"
                type="date"
                className="rounded-md"
                {...register("expirationDate", { valueAsDate: true })}
                defaultValue={format(nextFriday(new Date()), "yyyy-MM-dd")}
              />
              <p className="text-xs text-red-800">
                {formState.errors.date && "Trade Date is required"}
              </p>
            </div>
          )}
        </div>

        {assetType === AssetType.Option ? (
          <div className="flex gap-2">
            <div className="flex w-1/2 flex-col gap-1">
              <label htmlFor="underlyingSymbol" className="text-neutral-700">
                Underlying Symbol
              </label>
              <Controller
                control={control}
                name="underlyingSymbol"
                render={({ field }) => (
                  <SymbolAutocomplete
                    onChange={(symbol) => field.onChange(symbol)}
                  />
                )}
              />
              <p className="text-xs text-red-800">
                {formState.errors.underlyingSymbol &&
                  "Underlying symbol is required"}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="strike" className="text-neutral-700">
                Strike Price
              </label>
              <input
                id="strike"
                type="number"
                step="0.01"
                placeholder="100.00"
                className="w-full rounded-md"
                {...register("strikePrice", { valueAsNumber: true })}
              />
              <p className="text-xs text-red-800">
                {formState.errors.strikePrice && "Strike price is required"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label htmlFor="symbol" className="text-neutral-700">
              Symbol
            </label>
            <Controller
              control={control}
              name="symbol"
              render={({ field }) => (
                <SymbolAutocomplete
                  onChange={(symbol) => field.onChange(symbol)}
                />
              )}
            />
            <p className="text-xs text-red-800">
              {formState.errors.symbol && "Symbol is required"}
            </p>
          </div>
        )}

        <div className="flex">
          <div className="flex w-1/3 flex-col gap-1 px-1">
            <label htmlFor="price" className="text-neutral-700">
              {assetType === AssetType.Option ? "Option" : "Share"} Price
            </label>
            <input
              id="price"
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
          <div className="flex w-1/3 flex-col gap-1 px-1">
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
          <div className="flex w-1/3 flex-col gap-1 px-1">
            <label htmlFor="quantity" className="text-neutral-700">
              {assetType === AssetType.Option ? "# Contracts" : "# Shares"}
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
        </div>
      </div>
      <div className="mt-2 flex gap-1 px-1 ">
        <input
          id="isClosed"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
          {...register("isClosed")}
        />
        <label
          htmlFor="trade"
          className="ml-3  font-medium leading-6 text-gray-900"
        >
          Did you close out this trade?
        </label>
      </div>

      {isClosed && (
        <>
          <div className="mt-5 flex w-1/2 flex-col gap-1">
            <label htmlFor="exitDate" className="text-neutral-700">
              Exit Date
            </label>
            <input
              id="exitDate"
              type="datetime-local"
              className="rounded-md"
              {...register("exitDate", { valueAsDate: true })}
              defaultValue={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            />
            <p className="text-xs text-red-800">
              {formState.errors.exitDate && "Exit Date is required"}
            </p>
          </div>
          <div className="flex">
            <div className="flex w-1/3 flex-col gap-1 px-1">
              <label htmlFor="exitSharePrice" className="text-neutral-700">
                {assetType === AssetType.Option ? "Option" : "Share"} Price
              </label>
              <input
                id="exitSharePrice"
                type="number"
                step="0.01"
                placeholder="100.00"
                className="rounded-md"
                {...register("exitSharePrice", {
                  setValueAs: (value) => {
                    return Number(value);
                  },
                })}
              />
              <p className="text-xs text-red-800">
                {formState.errors.exitSharePrice && "Exit Price is required"}
              </p>
            </div>
            <div className="flex w-1/3 flex-col gap-1 px-1">
              <label htmlFor="exitFees" className="text-neutral-700">
                Total Fees
              </label>
              <input
                id="exitFees"
                type="number"
                placeholder="10.00"
                step="0.01"
                className="rounded-md"
                {...register("exitFees", { valueAsNumber: true })}
              />
              <p className="text-xs text-red-800">
                {formState.errors.exitFees && "Exit Fee is required"}
              </p>
            </div>
            <div className="flex w-1/3 flex-col gap-1 px-1">
              <label htmlFor="exitQuantity" className="text-neutral-700">
                {assetType === AssetType.Option ? "# Contracts" : "# Shares"}
              </label>
              <input
                id="exitQuantity"
                type="number"
                className="rounded-md"
                defaultValue={1}
                {...register("exitQuantity", { valueAsNumber: true })}
              />
              <p className="text-xs text-red-800">
                {formState.errors.exitQuantity && "exit Quantity is required"}
              </p>
            </div>
          </div>
        </>
      )}
      <hr className="my-4 h-0.5 bg-neutral-400" />

      <div className="flex justify-end gap-2">
        <button
          className="flex items-center gap-2 rounded-lg bg-red-400 px-3 py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-red-400/70 disabled:cursor-not-allowed disabled:bg-red-400/50 md:px-2"
          type="submit"
        >
          <CloudArrowUpIcon className="h-5 w-5" />
          {isLoading ? "Saving..." : "Save trade"}
        </button>
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
  onClose: () => void;
};

export default TransactionForm;
