import React from "react";
import {
  type OptionsTransactionInput,
  optionsTransactionInputSchema,
  type OptionTransactionInput,
} from "~/server/strategies/transaction";
import {
  Controller,
  type SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { OpenClose, OptionAction, OptionType } from "trackgreeks-database";
import { SymbolAutocompleteNew } from "~/components/molecules/SymbolAutocompletNew";
import GroupButton from "~/components/FlowBite/GroupButton";
import { SingleDatePicker } from "~/components/FlowBite/SingleDatePicker";
import Checkbox from "~/components/atoms/Checkbox";
import ErrorMessage from "~/components/atoms/ErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toastProps } from "~/styles/toast";
import { api } from "~/utils/api";
import { toast } from "react-toastify";

type Props = {
  setModalOpen: (flag: boolean) => void;
};

export default function AddTransactionsLast({ setModalOpen }: Props) {
  const { handleSubmit, formState, control } = useForm<OptionsTransactionInput>(
    {
      resolver: zodResolver(optionsTransactionInputSchema),
      defaultValues: {
        details: [
          {
            action: OptionAction.Buy,
            optionType: OptionType.Call,
            openClose: OpenClose.Open,
            quantity: 1,
            fees: 0,
            strikePrice: 0,
            optionPrice: 0,
            transactionDate: new Date(),
            expirationDate: new Date(), // set as Date object
            isClosingPosition: false,
          },
        ],
        closing: [
          {
            action: OptionAction.Sell,
            optionType: OptionType.Call,
            openClose: OpenClose.Close,
            quantity: 1,
            fees: 0,
            strikePrice: 0,
            optionPrice: 0.01,
            transactionDate: new Date(),
            expirationDate: new Date(), // set as Date object
          },
        ],
      },
    }
  );

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "details",
  });
  const {
    fields: closingFields,
    append: appendClosing,
    update: updateClosing,
  } = useFieldArray({
    control,
    name: "closing",
  });

  const { mutate, isLoading, isError, error } =
    api.transactions.addOptionTransaction.useMutation();
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<OptionsTransactionInput> = (data) => {
    data.details.forEach((d, i) => {
      const option: OptionTransactionInput = {
        underlyingSymbol: data.underlyingSymbol,
        ...d,
      };
      mutate(option);

      if (data.details[i]?.isClosingPosition) {
        // @ts-ignore
        const closingPositionData: OptionTransactionInput = {
          ...data.closing[i],
          action: option.action == "Buy" ? "Sell" : "Buy",
          openClose: option.openClose == "Open" ? "Close" : "Open",
          underlyingSymbol: option.underlyingSymbol,
          strikePrice: option.strikePrice,
          optionType: option.optionType,
          expirationDate: option.expirationDate,
        };
        mutate(closingPositionData);
      }
    });

    void utils.transactions.getOptionTransactions.invalidate();
    void utils.strategies.getStrategies.invalidate();
    void utils.transactions.getOptionTransactions.invalidate();
    void utils.transactions.getAllUserTransactions.invalidate();
    setModalOpen(false);
    toast.success("saved trade", toastProps);
  };

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

  return (
    <div>
      <>
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
              {fields.map((field, leg) => (
                <>
                  <div className="flex justify-between">
                    <p className="font-normal">
                      {addNumberSuffix(leg + 1)} Leg
                    </p>
                    {leg !== 0 && (
                      <Image
                        onClick={() => remove(leg)}
                        src={"../../../icons/x-outline.svg"}
                        alt="a"
                        width={12}
                        height={12}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                  <div className="m-auto rounded-lg bg-gray-50 p-3">
                    <div className="mb-4 flex justify-center">
                      <GroupButton
                        selectedOptions={{
                          profile: field.action,
                          call: field.optionType,
                        }}
                        setSelectedOptions={(_) => {
                          // console.log(f)
                        }}
                        setValue={(t, value) => {
                          if (t == "action") {
                            update(leg, {
                              ...field,
                              action: value,
                            });
                          } else if (t == "optionType") {
                            update(leg, {
                              ...field,
                              optionType: value,
                            });
                          }
                        }}
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
                          selectedDate={field.transactionDate}
                          setSelectedDate={(date) =>
                            update(leg, {
                              ...field,
                              transactionDate: date,
                            })
                          }
                        />
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
                          selectedDate={field.expirationDate}
                          setSelectedDate={(date) =>
                            update(leg, {
                              ...field,
                              expirationDate: date,
                            })
                          }
                        />
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
                          value={field.strikePrice}
                          onChange={(e) => {
                            update(leg, {
                              ...field,
                              strikePrice: Number(e.target.value),
                            });
                          }}
                        />
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
                          value={field.optionPrice}
                          onChange={(e) => {
                            update(leg, {
                              ...field,
                              optionPrice: Number(e.target.value),
                            });
                          }}
                        />
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
                          value={field.quantity}
                          onChange={(e) => {
                            update(leg, {
                              ...field,
                              quantity: Number(e.target.value),
                            });
                          }}
                        />
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
                          value={field.fees}
                          onChange={(e) => {
                            update(leg, {
                              ...field,
                              fees: Number(e.target.value),
                            });
                          }}
                        />
                      </div>
                    </div>

                    {/*<AddLegNew actions={actions} />*/}
                  </div>
                  <div className="py-4">
                    {!field.isClosingPosition ? (
                      <Checkbox
                        id="closing"
                        checked={field.isClosingPosition}
                        title="Add closing Trade"
                        onChange={() => {
                          update(leg, { ...field, isClosingPosition: true });
                          updateClosing(leg, {
                            action: OptionAction.Sell,
                            optionType: OptionType.Call,
                            openClose: OpenClose.Close,
                            quantity: 1,
                            fees: 0,
                            strikePrice: 0,
                            optionPrice: 0.01,
                            transactionDate: new Date(),
                            expirationDate: new Date(), // set as Date object
                          });
                        }}
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
                              left
                              selectedDate={closingFields[leg].transactionDate}
                              setSelectedDate={(date) =>
                                updateClosing(leg, {
                                  ...closingFields[leg],
                                  transactionDate: date,
                                })
                              }
                            />
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
                              value={closingFields[leg].optionPrice}
                              onChange={(e) => {
                                updateClosing(leg, {
                                  ...closingFields[leg],
                                  optionPrice: Number(e.target.value),
                                });
                              }}
                            />
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
                              value={closingFields[leg].quantity}
                              onChange={(e) => {
                                updateClosing(leg, {
                                  ...closingFields[leg],
                                  quantity: Number(e.target.value),
                                });
                              }}
                            />
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
                              value={closingFields[leg].fees}
                              onChange={(e) => {
                                updateClosing(leg, {
                                  ...closingFields[leg],
                                  fees: Number(e.target.value),
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {leg === fields.length - 1 && (
                    <button
                      className="mx-auto mb-4 flex gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        append({
                          action: OptionAction.Buy,
                          optionType: OptionType.Call,
                          openClose: OpenClose.Open,
                          quantity: 1,
                          fees: 0,
                          strikePrice: 0,
                          optionPrice: 0,
                          transactionDate: new Date(),
                          expirationDate: new Date(),
                          isClosingPosition: false,
                        });
                        appendClosing({
                          action: OptionAction.Sell,
                          optionType: OptionType.Call,
                          openClose: OpenClose.Close,
                          quantity: 1,
                          fees: 0,
                          strikePrice: 0,
                          optionPrice: 0.01,
                          transactionDate: new Date(),
                          expirationDate: new Date(),
                        });
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
                  )}
                </>
              ))}
            </div>

            <button
              className="w-full rounded-lg bg-teal-600 py-3 text-white no-underline drop-shadow transition duration-150
              ease-in-out disabled:cursor-not-allowed"
              type="submit"
            >
              {isLoading ? "Adding Trade..." : "Add Trade"}
            </button>
          </form>
          {isError && (
            <ErrorMessage>
              Failed to save trade, try again! Error: {error.message}
            </ErrorMessage>
          )}
        </div>
      </>
    </div>
  );
}
