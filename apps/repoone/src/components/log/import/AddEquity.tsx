import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import React, { useState } from "react";
import {
  type EquityTransactionInput,
  equityTransactionInputSchema,
} from "~/server/strategies/transaction";
import { OpenClose, Position } from "opcalc-database";
import { zodResolver } from "@hookform/resolvers/zod";
import { SymbolAutocompleteNew } from "~/components/molecules/SymbolAutocompletNew";
import { SingleDatePicker } from "~/components/FlowBite/SingleDatePicker";
import Image from "next/image";
import { api } from "~/utils/api";
import { toastProps } from "~/styles/toast";
import { toast } from "react-toastify";

type Props = {
  setModalOpen: (flag: boolean) => void;
};

export default function AddEquity({ setModalOpen }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expirationDate, setExpirationDate] = useState(new Date());

  const initialState = {
    transactionDate: new Date(),
    sharePrice: null,
    quantity: 1,
    position: Position.Long,
    openClose: OpenClose.Open,
    fees: null,
  };

  const [selectedOptions, setSelectedOptions] = useState<Position>(
    Position.Long
  );

  const [closingPosition, setClosingPosition] = useState<boolean>(false);

  const { register, handleSubmit, formState, control } =
    useForm<EquityTransactionInput>({
      resolver: zodResolver(equityTransactionInputSchema),
      defaultValues: {
        ...initialState,
        transactionDate: selectedDate, // set as Date object
      },
    });

  const closingPositionForm = useForm<EquityTransactionInput>({
    resolver: zodResolver(equityTransactionInputSchema),
    defaultValues: {
      ...initialState,
      transactionDate: expirationDate, // set as Date object
    },
  });

  const { mutate, isLoading } =
    api.transactions.addEquityTransaction.useMutation();
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<EquityTransactionInput> = (data) => {
    data.transactionDate = selectedDate;
    data.position = selectedOptions;
    if (!data.fees) {
      data.fees = 0;
    }

    mutate(data, {
      onSuccess: () => {
        if (!closingPosition) {
          utils.transactions.getEquityTransactions.invalidate();
          toast.success("saved trade", toastProps);
          setModalOpen(false);
        } else {
          const closingPositionData = closingPositionForm.getValues();
          closingPositionData.transactionDate = expirationDate;
          closingPositionData.symbol = data.symbol;
          closingPositionData.position =
            data.position == Position.Short ? Position.Long : Position.Short;
          closingPositionData.openClose =
            data.openClose == OpenClose.Close
              ? OpenClose.Open
              : OpenClose.Close;
          if (!closingPositionData.fees) {
            closingPositionData.fees = 0;
          }
          mutate(closingPositionData, {
            onSuccess: () => {
              utils.transactions.getEquityTransactions.invalidate();
              toast.success("saved trade", toastProps);
              setModalOpen(false);
            },
          });
        }
      },
    });
  };

  const checkInputValue = (
    field: number | null | undefined
  ): string | number => {
    return field != null ? field.toString() : "";
  };

  const preventChangeInput = (e: any): void => {
    const target = e.target as HTMLInputElement;
    target.blur();
  };

  const validateAndSetInput = (e: any, n: number) => {
    return e.target.value === ""
      ? null
      : Number(e.target.value) < n
      ? n
      : Number(e.target.value);
  };

  return (
    <form
      className="flex w-full flex-col items-center gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <label htmlFor="symbol" className="mb-1 font-medium text-gray-900">
          Symbol
        </label>
        <Controller
          control={control}
          name="symbol"
          render={({ field }) => (
            <SymbolAutocompleteNew
              value={field.value ?? ""}
              onChange={(symbol) => field.onChange(symbol)}
            />
          )}
        />
      </div>
      <p className="self-start text-start text-xs text-red-800">
        {formState.errors.symbol && "Stock ticker is required"}
      </p>
      <div className="inline-flex h-[37px] w-full px-2" role="group">
        <button
          type="button"
          className={`inline-flex w-full items-center justify-center rounded-s-lg border border-gray-200 px-8 py-2 text-center text-sm font-medium text-gray-500 ${
            selectedOptions === Position.Long
              ? "bg-gray-100 text-gray-900 focus:z-10"
              : "bg-white"
          }`}
          onClick={() => setSelectedOptions(Position.Long)}
        >
          Buy
        </button>
        <button
          type="button"
          className={`inline-flex w-full items-center justify-center rounded-e-lg border border-gray-200 px-7 py-2 text-center text-sm font-medium text-gray-500 ${
            selectedOptions === Position.Short
              ? "bg-gray-100 text-gray-900 focus:z-10"
              : "bg-white "
          }`}
          onClick={() => setSelectedOptions(Position.Short)}
        >
          Sell
        </button>
      </div>
      <div className="mb-4 flex items-center justify-center gap-3 px-3">
        <div className="flex w-[178px] flex-col">
          <label
            htmlFor="transactionDate"
            className="text-sm font-medium text-gray-900"
          >
            Entry Date
          </label>
          <SingleDatePicker
            id="transactionDate"
            type="datetime-local"
            // className="rounded-md"
            left
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            {...register("transactionDate", { valueAsDate: true })}
          />
          <p className="text-xs text-red-800">
            {formState.errors.transactionDate && "Transaction date is required"}
          </p>
        </div>
        <div className="flex w-[178px] flex-col gap-1">
          <label htmlFor="strike" className="text-sm font-medium text-gray-900">
            Share Price
          </label>
          <Controller
            control={control}
            name="sharePrice"
            render={({ field }) => (
              <input
                id="strike"
                type="number"
                placeholder="0"
                step="0.01"
                className="rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={checkInputValue(field.value)}
                onWheel={(e) => preventChangeInput(e)}
                onChange={(e) => {
                  field.onChange(validateAndSetInput(e, 0));
                }}
              />
            )}
          />
          <p className="text-xs text-red-800">
            {formState.errors.sharePrice && "price is required"}
          </p>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-center gap-3 px-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="strike" className="text-sm font-medium text-gray-900">
            # of Shares
          </label>
          <Controller
            control={control}
            name="quantity"
            render={({ field }) => (
              <input
                id="strike"
                type="number"
                placeholder="0"
                className="w-full rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={checkInputValue(field.value)}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    field.onChange(1);
                  }
                }}
                onWheel={(e) => preventChangeInput(e)}
                onChange={(e) => {
                  field.onChange(validateAndSetInput(e, 1));
                }}
              />
            )}
          />
          <p className="text-xs text-red-800">
            {formState.errors.quantity && "quantity is required"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="strike" className="text-sm font-medium text-gray-900">
            Fees
          </label>
          <Controller
            control={control}
            name="fees"
            render={({ field }) => (
              <input
                id="strike"
                type="number"
                placeholder="0"
                step="0.01"
                className="w-full rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={checkInputValue(field.value)}
                onWheel={(e) => preventChangeInput(e)}
                onChange={(e) => {
                  field.onChange(validateAndSetInput(e, 0));
                }}
              />
            )}
          />
          <p className="text-xs text-red-800">
            {formState.errors.fees && "fees are required"}
          </p>
        </div>
      </div>
      {!closingPosition ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            setClosingPosition(true);
          }}
          className="flex items-center justify-center gap-2 self-start pl-4"
        >
          <Image
            src={"../../../icons/plus.svg"}
            alt="a"
            width={25}
            height={25}
          />
          <span className="text-sm">Add a closing position</span>
        </button>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-center gap-3 px-3">
            <div className="flex w-[178px] flex-col gap-1">
              <label
                htmlFor="transactionDate"
                className="text-sm font-medium text-gray-900"
              >
                Exit Date
              </label>
              <SingleDatePicker
                id="transactionDateExpire"
                type="datetime-local"
                // className="rounded-md"
                selectedDate={expirationDate}
                left
                setSelectedDate={setExpirationDate}
                {...closingPositionForm.register("transactionDate", {
                  valueAsDate: true,
                })}
              />
              <p className="text-xs text-red-800">
                {formState.errors.transactionDate &&
                  "Transaction date is required"}
              </p>
            </div>
            <div className="flex w-[178px] flex-col gap-1">
              <label
                htmlFor="strike"
                className="text-sm font-medium text-gray-900"
              >
                Share Price
              </label>
              <Controller
                control={closingPositionForm.control}
                name="sharePrice"
                render={({ field }) => (
                  <input
                    id="strike"
                    type="number"
                    placeholder="0"
                    step="0.01"
                    className="w-full rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                    value={checkInputValue(field.value)}
                    onWheel={(e) => preventChangeInput(e)}
                    onChange={(e) => {
                      field.onChange(validateAndSetInput(e, 0));
                    }}
                  />
                )}
              />
              <p className="text-xs text-red-800">
                {formState.errors.sharePrice && "Strike price is required"}
              </p>
            </div>
          </div>
          <div className="mb-4 flex items-center justify-center gap-3  px-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="strike"
                className="text-sm font-medium text-gray-900"
              >
                # of Shares
              </label>
              <Controller
                control={closingPositionForm.control}
                name="quantity"
                render={({ field }) => (
                  <input
                    id="strike"
                    type="number"
                    placeholder="0"
                    className="w-full rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                    value={checkInputValue(field.value)}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        field.onChange(1);
                      }
                    }}
                    onWheel={(e) => preventChangeInput(e)}
                    onChange={(e) => {
                      field.onChange(validateAndSetInput(e, 1));
                    }}
                  />
                )}
              />
              <p className="text-xs text-red-800">
                {formState.errors.quantity && "Strike price is required"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="strike"
                className="text-sm font-medium text-gray-900"
              >
                Fees
              </label>
              <Controller
                control={closingPositionForm.control}
                name="fees"
                render={({ field }) => (
                  <input
                    id="strike"
                    type="number"
                    placeholder="0"
                    step="0.01"
                    className="w-full rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                    value={checkInputValue(field.value)}
                    onWheel={(e) => preventChangeInput(e)}
                    onChange={(e) => {
                      field.onChange(validateAndSetInput(e, 0));
                    }}
                  />
                )}
              />
              <p className="text-xs text-red-800">
                {formState.errors.fees && "Strike price is required"}
              </p>
            </div>
          </div>
        </div>
      )}
      <button
        className="hover:bg- w-full rounded-lg bg-gray-900 py-2.5 text-white no-underline drop-shadow transition
        duration-150 ease-in-out hover:bg-gray-900/80 disabled:cursor-not-allowed"
        type="submit"
      >
        {isLoading ? "Adding Trade..." : "Add Trade"}
      </button>
    </form>
  );
}
