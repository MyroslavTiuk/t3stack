import React, { useState } from "react";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import ErrorMessage from "~/components/atoms/ErrorMessage";
import {
  type OptionTransactionInput,
  optionTransactionInputSchema,
  type EquityTransactionInput,
} from "~/server/strategies/transaction";
import { OpenClose, OptionAction, OptionType } from "opcalc-database";
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";
import { SingleDatePicker } from "~/components/FlowBite/SingleDatePicker";
import GroupButton from "~/components/FlowBite/GroupButton";
import { SymbolAutocompleteNew } from "~/components/molecules/SymbolAutocompletNew";
import Image from "next/image";
import Checkbox from "~/components/atoms/Checkbox";

function addNumberSuffix(leg: number) {
  if (leg >= 11 && leg <= 13) {
    // Special case for 11th, 12th, and 13th
    return leg + "th";
  }

  const lastDigit = leg % 10;
  let suffix;

  switch (lastDigit) {
    case 1:
      suffix = "st";
      break;
    case 2:
      suffix = "nd";
      break;
    case 3:
      suffix = "rd";
      break;
    default:
      suffix = "th";
  }

  return leg + suffix;
}
const OptionTransactionFormNew: React.FC<Props> = ({
  remove,
  addOptionLeg,
  initialState,
  leg,
  setModalOpen,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [exitDate, setExitDate] = useState(new Date());
  const [selectedOptions, setSelectedOptions] = useState({
    profile: OptionAction.Buy,
    call: OptionType.Call,
  });
  const [closingPosition, setClosingPosition] = useState<boolean>(false);

  const { register, handleSubmit, formState, control, setValue } =
    useForm<OptionTransactionInput>({
      resolver: zodResolver(optionTransactionInputSchema),
      defaultValues: {
        action: selectedOptions.profile,
        optionType: selectedOptions.call,
        openClose: OpenClose.Open,
        quantity: 1,
        fees: 0,
        ...initialState,
        transactionDate: selectedDate, // set as Date object
        expirationDate: expirationDate, // set as Date object
      },
    });

  const closingPositionForm = useForm<OptionTransactionInput>({
    resolver: zodResolver(optionTransactionInputSchema),
    defaultValues: {
      action: selectedOptions.profile,
      optionType: selectedOptions.call,
      openClose: OpenClose.Close,
      quantity: 1,
      fees: 0,
      ...initialState,
      transactionDate: exitDate, // set as Date object
      expirationDate: expirationDate, // set as Date object
    },
  });
  const { mutate, isLoading, isError, error } =
    api.transactions.addOptionTransaction.useMutation();
  const onSubmit: SubmitHandler<OptionTransactionInput> = (data) => {
    data.expirationDate = expirationDate;
    data.transactionDate = selectedDate;
    data.optionType = selectedOptions.call;
    data.action = selectedOptions.profile;
    mutate(data, {
      onSuccess: () => {
        if (!closingPosition) {
          remove();
          void utils.transactions.getOptionTransactions.invalidate();
          toast.success("saved trade", toastProps);
          setModalOpen(false);
        } else {
          const closingPositionData = closingPositionForm.getValues();
          closingPositionData.expirationDate = expirationDate;
          closingPositionData.transactionDate = exitDate;
          closingPositionData.underlyingSymbol = data.underlyingSymbol;
          closingPositionData.optionType = selectedOptions.call;
          closingPositionData.action =
            selectedOptions.profile == "Buy" ? "Sell" : "Buy";
          closingPositionData.strikePrice = data.strikePrice;
          closingPositionData.openClose =
            data.openClose == OpenClose.Close
              ? OpenClose.Open
              : OpenClose.Close;
          mutate(closingPositionData, {
            onSuccess: () => {
              remove();
              void utils.transactions.getOptionTransactions.invalidate();
              toast.success("saved trade", toastProps);
              setModalOpen(false);
            },
          });
        }
      },
    });
  };
  const utils = api.useUtils();

  // TODO: based on expiry date: if in past offer expiry/ assignment

  return (
    <>
      <div className="flex justify-between">
        <p className="font-normal">{addNumberSuffix(leg)} Leg</p>
        {leg !== 1 && (
          <Image
            onClick={() => remove()}
            src={"../../../icons/x-outline.svg"}
            alt="a"
            width={12}
            height={12}
            className="cursor-pointer"
          />
        )}
      </div>

      <div className="m-auto w-[376px] rounded-lg py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto">
          <div className="flex-col">
            <div className="mb-4 flex w-20 flex-col justify-between">
              <label
                htmlFor="underlyingSymbol"
                className="text-sm font-medium text-gray-900"
              >
                Symbol
              </label>
              <Controller
                control={control}
                name="underlyingSymbol"
                render={({ field }) => (
                  <SymbolAutocompleteNew
                    value={field.value ?? ""}
                    onChange={(symbol) => field.onChange(symbol)}
                  />
                )}
              />
              <p className="text-xs text-red-800">
                {formState.errors.underlyingSymbol &&
                  "Stock ticker is required"}
              </p>
            </div>
            <div className="m-auto rounded-lg bg-gray-50 p-3">
              <div className="mb-4 flex justify-center">
                <GroupButton
                  selectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  setValue={setValue}
                />
              </div>
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="transactionDate"
                    className="text-sm font-medium text-gray-900"
                  >
                    Entry Date
                  </label>
                  <SingleDatePicker
                    id="transactionDate"
                    type="datetime-local"
                    left
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    {...register("transactionDate", { valueAsDate: true })}
                  />
                  <p className="text-xs text-red-800">
                    {formState.errors.transactionDate &&
                      "Transaction date is required"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="expirationDate"
                    className="text-sm font-medium text-gray-900"
                  >
                    Expiration Date
                  </label>
                  <SingleDatePicker
                    id="expirationDate"
                    type="datetime-local"
                    selectedDate={expirationDate}
                    setSelectedDate={setExpirationDate}
                    {...register("expirationDate", { valueAsDate: true })}
                  />
                  <p className="text-xs text-red-800">
                    {formState.errors.expirationDate &&
                      "Expiration Date is required"}
                  </p>
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex w-[170px] flex-col gap-1">
                  <label
                    htmlFor="strike"
                    className="text-sm font-medium text-gray-900"
                  >
                    Strike Price
                  </label>
                  <input
                    id="strike"
                    type="number"
                    placeholder=""
                    className="rounded-md border-gray-200"
                    {...register("strikePrice", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-red-800">
                    {formState.errors.strikePrice && "Strike price is required"}
                  </p>
                </div>
                <div className="flex w-[170px] flex-col gap-1">
                  <label
                    htmlFor="optionPrice"
                    className="text-sm font-medium text-gray-900"
                  >
                    Option Price
                  </label>
                  <input
                    id="optionPrice"
                    type="number"
                    step="0.01"
                    placeholder=""
                    className="rounded-md border-gray-200"
                    {...register("optionPrice", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-red-800">
                    {formState.errors.optionPrice && "Price is required"}
                  </p>
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex w-[170px] flex-col gap-1">
                  <label
                    htmlFor="quantity"
                    className="text-sm font-medium text-gray-900"
                  >
                    # Contracts
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    className="rounded-md border-gray-200"
                    {...register("quantity", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-red-800">
                    {formState.errors.quantity && "Quantity is required"}
                  </p>
                </div>
                <div className="flex w-[170px] flex-col gap-1">
                  <label
                    htmlFor="fee"
                    className="text-sm font-medium text-gray-900"
                  >
                    Total Fees
                  </label>
                  <input
                    id="fee"
                    type="number"
                    placeholder="10.00"
                    step="0.01"
                    className="rounded-md border-gray-200"
                    {...register("fees", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-red-800">
                    {formState.errors.fees && "Fee is required"}
                  </p>
                </div>
              </div>

              {/*<AddLegNew actions={actions} />*/}
              <button
                className="mx-auto flex gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  addOptionLeg(initialState)();
                }}
              >
                <span className="sr-only">Open options</span>
                <Image
                  src={"../../../icons/plus.svg"}
                  alt="a"
                  width={20}
                  height={20}
                />
                <span>Add another leg</span>
              </button>
            </div>
            <div className="py-4">
              {!closingPosition ? (
                <Checkbox
                  id="closing"
                  checked={closingPosition}
                  title="Add closing Trade"
                  onChange={() => setClosingPosition(!closingPosition)}
                />
              ) : (
                <div>
                  <div className="mb-4 flex items-center justify-center gap-3">
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="transactionDate"
                        className="text-sm font-medium text-gray-900"
                      >
                        Exit Date
                      </label>
                      <SingleDatePicker
                        id="transactionDateExpire"
                        type="datetime-local"
                        selectedDate={exitDate}
                        left
                        setSelectedDate={setExitDate}
                      />
                      <p className="text-xs text-red-800">
                        {formState.errors.transactionDate &&
                          "Transaction date is required"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="strike"
                        className="text-sm font-medium text-gray-900"
                      >
                        Option Price
                      </label>
                      <input
                        id="strike"
                        type="number"
                        placeholder=""
                        step="0.01"
                        className="rounded-md border-gray-200"
                        {...closingPositionForm.register("optionPrice", {
                          valueAsNumber: true,
                        })}
                      />
                      <p className="text-xs text-red-800">
                        {formState.errors.optionPrice &&
                          "Strike price is required"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center justify-center gap-3  px-3">
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="strike"
                        className="text-sm font-medium text-gray-900"
                      >
                        # of Contracts
                      </label>
                      <input
                        id="strike"
                        type="number"
                        placeholder=""
                        className="w-full rounded-md border-gray-200"
                        {...closingPositionForm.register("quantity", {
                          valueAsNumber: true,
                        })}
                      />
                      <p className="text-xs text-red-800">
                        {formState.errors.quantity &&
                          "Strike price is required"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="strike"
                        className="text-sm font-medium text-gray-900"
                      >
                        Fees
                      </label>
                      <input
                        id="strike"
                        type="number"
                        placeholder=""
                        step="0.01"
                        className="w-full rounded-md border-gray-200"
                        {...closingPositionForm.register("fees", {
                          valueAsNumber: true,
                        })}
                      />
                      <p className="text-xs text-red-800">
                        {formState.errors.fees && "Strike price is required"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              className="w-full rounded-lg bg-black py-3 text-white no-underline drop-shadow transition duration-150
            ease-in-out disabled:cursor-not-allowed"
              type="submit"
            >
              {isLoading ? "Adding Trade..." : "Add Trade"}
            </button>
          </div>
        </form>
        {isError && (
          <ErrorMessage>
            Failed to save trade, try again! Error: {error.message}
          </ErrorMessage>
        )}
      </div>
    </>
  );
};

type Props = {
  initialState: Partial<OptionTransactionInput>;
  remove: () => void;
  addOptionLeg: (initialState: Partial<OptionTransactionInput>) => () => void;
  addEquityLeg: (initialState: Partial<EquityTransactionInput>) => () => void;
  leg: number;
  setModalOpen: (flag: boolean) => void;
};

export default OptionTransactionFormNew;
