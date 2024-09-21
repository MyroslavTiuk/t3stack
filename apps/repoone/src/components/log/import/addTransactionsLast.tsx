import React, { useEffect, useState } from "react";
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
  useWatch,
} from "react-hook-form";
import { OpenClose, OptionAction, OptionType } from "opcalc-database";
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
import ExpirationDateDropDown from "./ExpirationDateDropdown";
import { ExpirationDate } from "opc-types/lib/OptionData";

type Props = {
  setModalOpen: (flag: boolean) => void;
};

export default function AddTransactionsLast({ setModalOpen }: Props) {
  const { handleSubmit, formState, control, clearErrors } =
    useForm<OptionsTransactionInput>({
      resolver: zodResolver(optionsTransactionInputSchema),
      defaultValues: {
        details: [
          {
            action: OptionAction.Buy,
            optionType: OptionType.Call,
            openClose: OpenClose.Open,
            quantity: 1,
            fees: null,
            strikePrice: null,
            optionPrice: null,
            transactionDate: new Date(),
            expirationDate: null,
            isClosingPosition: false,
          },
        ],
        closing: [
          {
            action: OptionAction.Sell,
            optionType: OptionType.Call,
            openClose: OpenClose.Close,
            quantity: 1,
            fees: null,
            strikePrice: null,
            optionPrice: null,
            transactionDate: new Date(),
            expirationDate: null,
          },
        ],
      },
    });

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

  const symbol = useWatch({
    control,
    name: "underlyingSymbol",
    defaultValue: null,
  });

  const [expirationWasTriggered, setExpirationTriggered] = useState<boolean[]>([
    false,
  ]);

  const { mutate, isLoading, isError, error } =
    api.transactions.addOptionTransaction.useMutation();
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<OptionsTransactionInput> = (data) => {
    if (!data.details.every((d) => d.expirationDate)) {
      console.log("expiration is null");
      control.setError("details.0.expirationDate", {
        message: "Set Something",
      });
      return;
    }
    data.details.forEach((d, i) => {
      const option: OptionTransactionInput = {
        underlyingSymbol: data.underlyingSymbol,
        ...d,
        fees: d.fees ?? 0,
      };
      mutate(option);

      if (data.details[i]?.isClosingPosition) {
        const closingPositionData: OptionTransactionInput = {
          ...data.closing[i],
          fees: data.closing[i]?.fees ?? 0,
          transactionDate: data.closing[i]?.transactionDate ?? new Date(),
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

  const {
    data: dates,
    refetch,
    isLoading: isExpirationLoading,
  } = api.transactions.getOptionExpiration.useQuery(
    {
      symbol: symbol,
    },
    {
      manual: true,
      enabled: false,
    }
  );

  useEffect(() => {
    if (symbol) {
      refetch();
      clearErrors("underlyingSymbol");
      setExpirationTriggered((prev) => {
        return prev.map((_) => false);
      });
    }
  }, [symbol, refetch, clearErrors]);

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
    <div>
      <>
        <div className="m-auto w-[376px] rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto">
            <div className="flex-col">
              <div className="mb-4 flex w-20 flex-col justify-between">
                <label
                  htmlFor="underlyingSymbol"
                  className="mb-1 font-medium text-gray-900"
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
                <p className="w-36 text-xs text-red-800">
                  {formState.errors.underlyingSymbol &&
                    "Stock ticker is required"}
                </p>
              </div>
              {fields.map((field, leg) => (
                <>
                  <div className="m-auto rounded-lg bg-gray-50 p-3">
                    <div className="flex-column flex justify-between">
                      <p className="size-4 mb-4 font-semibold text-gray-900">
                        {addNumberSuffix(leg + 1)} Leg
                      </p>
                      <div className="mb-4 flex justify-between">
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
                    </div>
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
                    <div className="mb-4 flex items-start justify-center gap-3">
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
                        <p className="w-36 text-xs text-red-800">
                          {formState?.errors?.details &&
                            formState?.errors?.details[leg]?.transactionDate &&
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

                        <ExpirationDateDropDown
                          dates={
                            dates
                              ? dates.map((d: ExpirationDate) => d.date)
                              : []
                          }
                          onOpen={() => {
                            if (symbol) {
                              refetch();
                            } else {
                              // control._updateValid(true);
                              control.setError("underlyingSymbol", {
                                message:
                                  "Ticker is required in order to fetch expiration date",
                              });
                            }
                          }}
                          setDate={(date: Date) => {
                            update(leg, {
                              ...field,
                              expirationDate: date,
                            });
                            if (!expirationWasTriggered[leg]) {
                              setExpirationTriggered((prev) => {
                                const newExpiration = prev;
                                newExpiration[leg] = true;
                                return newExpiration;
                              });
                            }
                          }}
                          selected={
                            dates && expirationWasTriggered[leg]
                              ? field.expirationDate
                              : null
                          }
                          disabled={symbol == null || symbol == undefined}
                          // @ts-ignore
                          isLoading={isExpirationLoading && symbol}
                        />

                        <p className="w-36 text-xs text-red-800">
                          {formState?.errors?.details &&
                            formState?.errors?.details[leg]?.expirationDate &&
                            "Expiration date is required"}
                        </p>
                        {/* <SingleDatePicker
                          id="expirationDate"
                          type="datetime-local"
                          selectedDate={field.expirationDate}
                          setSelectedDate={(date) =>
                            update(leg, {
                              ...field,
                              expirationDate: date,
                            })
                          }
                        /> */}
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
                          placeholder="0"
                          className="rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                          value={checkInputValue(field.strikePrice)}
                          onWheel={(e) => preventChangeInput(e)}
                          onChange={(e) => {
                            update(leg, {
                              ...field,
                              strikePrice: validateAndSetInput(e, 0),
                            });
                          }}
                        />
                        <p className="w-48 text-xs text-red-800">
                          {formState?.errors?.details &&
                            formState?.errors?.details[leg]?.strikePrice &&
                            "Strike price is required"}
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
                          placeholder="0"
                          className="rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                          value={checkInputValue(field.optionPrice)}
                          onWheel={(e) => preventChangeInput(e)}
                          onChange={(e) => {
                            update(leg, {
                              ...field,
                              optionPrice: validateAndSetInput(e, 0),
                            });
                          }}
                        />
                        <p className="w-48 text-xs text-red-800">
                          {formState?.errors?.details &&
                            formState?.errors?.details[leg]?.strikePrice &&
                            "Option price is required"}
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
                          className="rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                          placeholder="0"
                          value={checkInputValue(field.quantity)}
                          onWheel={(e) => preventChangeInput(e)}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              update(leg, {
                                ...fields[leg],
                                quantity: 1,
                              });
                            }
                          }}
                          onChange={(e) => {
                            update(leg, {
                              ...field,
                              quantity: validateAndSetInput(e, 1),
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
                          placeholder="0"
                          step="0.01"
                          className="rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                          value={checkInputValue(field.fees)}
                          onWheel={(e) => preventChangeInput(e)}
                          onChange={(e) => {
                            update(leg, {
                              ...field,
                              fees: validateAndSetInput(e, 0),
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
                            fees: null,
                            strikePrice: null,
                            optionPrice: null,
                            transactionDate: new Date(),
                            expirationDate: new Date(), // set as Date object
                          });
                        }}
                      />
                    ) : (
                      <div className="m-auto rounded-lg bg-gray-50 p-3">
                        <p className="size-4 mb-3 font-normal font-semibold text-gray-900">
                          {addNumberSuffix(leg + 1)} Leg
                        </p>
                        <div className="mb-4 flex items-center justify-center gap-3">
                          <div className="flex w-[170px] flex-col gap-1">
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
                          <div className="flex w-[170px] flex-col gap-1">
                            <label
                              htmlFor="strike"
                              className="text-sm font-medium text-gray-900"
                            >
                              Option Price
                            </label>
                            <input
                              id="strike"
                              type="number"
                              placeholder="0"
                              step="0.01"
                              className="rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                              value={checkInputValue(
                                closingFields[leg].optionPrice
                              )}
                              onWheel={(e) => preventChangeInput(e)}
                              onChange={(e) => {
                                updateClosing(leg, {
                                  ...closingFields[leg],
                                  optionPrice: validateAndSetInput(e, 0),
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="mb-4 flex items-center justify-center gap-3">
                          <div className="flex w-[170px] flex-col gap-1">
                            <label
                              htmlFor="strike"
                              className="text-sm font-medium text-gray-900"
                            >
                              # of Contracts
                            </label>
                            <input
                              id="strike"
                              type="number"
                              placeholder="0"
                              className="rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                              value={checkInputValue(
                                closingFields[leg].quantity
                              )}
                              onWheel={(e) => preventChangeInput(e)}
                              onBlur={(e) => {
                                if (e.target.value === "") {
                                  updateClosing(leg, {
                                    ...closingFields[leg],
                                    quantity: 1,
                                  });
                                }
                              }}
                              onChange={(e) => {
                                updateClosing(leg, {
                                  ...closingFields[leg],
                                  quantity: validateAndSetInput(e, 1),
                                });
                              }}
                            />
                          </div>
                          <div className="flex w-[170px] flex-col gap-1">
                            <label
                              htmlFor="strike"
                              className="text-sm font-medium text-gray-900"
                            >
                              Fees
                            </label>
                            <input
                              id="strike"
                              type="number"
                              placeholder="0"
                              step="0.01"
                              className="rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                              value={checkInputValue(closingFields[leg].fees)}
                              onWheel={(e) => preventChangeInput(e)}
                              onChange={(e) => {
                                updateClosing(leg, {
                                  ...closingFields[leg],
                                  fees: validateAndSetInput(e, 0),
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
                          fees: null,
                          strikePrice: null,
                          optionPrice: null,
                          transactionDate: new Date(),
                          expirationDate: null,
                          isClosingPosition: false,
                        });
                        appendClosing({
                          action: OptionAction.Sell,
                          optionType: OptionType.Call,
                          openClose: OpenClose.Close,
                          quantity: 1,
                          fees: null,
                          strikePrice: null,
                          optionPrice: null,
                          transactionDate: new Date(),
                          expirationDate: new Date(),
                        });
                        setExpirationTriggered((prev) => {
                          const newExpirations = prev;
                          newExpirations.push(false);
                          return newExpirations;
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
              className="hover:bg- w-full rounded-lg bg-gray-900 py-2.5 text-white no-underline drop-shadow transition
              duration-150 ease-in-out hover:bg-gray-900/80 disabled:cursor-not-allowed"
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
