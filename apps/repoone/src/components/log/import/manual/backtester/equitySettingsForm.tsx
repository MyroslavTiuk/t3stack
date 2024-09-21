/* eslint-disable no-console */
import { ExclamationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BackTestDropDown from "~/components/FlowBite/backtester/BackTestDropDown";
import {
  type EquityBackTestInput,
  equityBackTestInputSchema,
} from "~/server/strategies/backtest";
import { toastProps } from "~/styles/toast";
import { PlusIcon } from "@heroicons/react/24/outline";
import CustomDateRangePicker from "~/components/FlowBite/backtester/DateRangePicker";
import { formatYear, unFormatYear } from "~/utils/formatYear";
import { api } from "~/utils/api";
import {
  criteria,
  dropdownItems,
  resetStockPrice,
  showResetStockPrice,
} from "./utils/dropdown";
import {
  type entryCriteriaType,
  type exitAndCriteriaType,
  type exitOrCriteriaType,
} from "./utils/types";
import {
  type ICriterias,
  type RefetchOptionsWithSymbols,
} from "./utils/interfaces";
import { useRouter } from "next/router";
type Props = {
  backTestCalc: any;
  setBackTestCalc: Dispatch<SetStateAction<any>>;
  initialState: Partial<EquityBackTestInput>;
  selectedSymbol: string[];
  setIsFormSubmitted: Dispatch<SetStateAction<boolean>>;
  setEquityLoading: (val: boolean) => void;
};
const EquitySettingsForm = ({
  selectedSymbol,
  setBackTestCalc,
  setIsFormSubmitted,
  setEquityLoading,
}: Props) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [resultForm, setResultForm] = useState<any>(null);
  const [entryCriteria, setEntryCriteria] = useState<ICriterias[]>([
    {
      positionCriteria: "Select",
      positionValue: 0,
    },
  ]); // Keep track of added criteria fields
  const [exitAndCriteria, setExitAndCriteria] = useState<ICriterias[]>([
    {
      positionCriteria: "Select",
      positionValue: 0,
    },
  ]);
  const [exitOrCriteria, setExitOrCriteria] = useState<ICriterias[]>([]);
  const positionSize = ["Shares amount", "Dollar amount"];

  const addCriteriaField = () => {
    if (entryCriteria.length >= 5) {
      return;
    }
    setEntryCriteria((prevCriteria) => [
      ...prevCriteria,
      {
        positionCriteria: "Select",
        positionValue: 0,
      },
    ]);
  };

  const removeCriteriaField = (index: number) => {
    setEntryCriteria((prevFields) => {
      const updatedFields = [...prevFields];
      if (updatedFields.length === 1) {
        return updatedFields;
      }
      updatedFields.splice(index, 1);
      setValue(`entryCriteria.${index}.positionCriteria`, "Select");
      setValue(`entryCriteria.${index}.positionValue`, 0);
      return updatedFields;
    });
  };

  const addExitCriteriaField = (type: "and" | "or") => {
    const newCriteriaField = {
      positionCriteria: "Select",
      positionValue: 0,
    };
    if (type === "and") {
      setExitAndCriteria((prevFields) => [...prevFields, newCriteriaField]);
    } else {
      setExitOrCriteria((prevFields) => [...prevFields, newCriteriaField]);
    }
  };

  const removeExitCriteriaField = (index: number, type: "and" | "or") => {
    if (type === "and") {
      if (exitAndCriteria.length === 1) {
        return;
      }
      setExitAndCriteria((prevFields) => {
        const updatedFields = [...prevFields];
        updatedFields.splice(index, 1);
        return updatedFields;
      });
      setValue(`exitAndCriteria.${index}.positionCriteria`, "Select");
      setValue(`exitAndCriteria.${index}.positionValue`, 0);
    } else {
      setExitOrCriteria((prevFields) => {
        const updatedFields = [...prevFields];
        updatedFields.splice(index, 1);
        return updatedFields;
      });
      setValue(`exitOrCriteria.${index}.positionCriteria`, "Select");
      setValue(`exitOrCriteria.${index}.positionValue`, 0);
    }
  };

  const shouldRenderResetStockPrice =
    entryCriteria.some((criteria) =>
      showResetStockPrice.includes(criteria.positionCriteria)
    ) ||
    exitAndCriteria.some((criteria) =>
      showResetStockPrice.includes(criteria.positionCriteria)
    ) ||
    exitOrCriteria.some((criteria) =>
      showResetStockPrice.includes(criteria.positionCriteria)
    );

  const isDateRangeSelected =
    startDate !== null && endDate !== null && endDate >= startDate;

  const { register, handleSubmit, control, watch, setValue } =
    useForm<EquityBackTestInput>({
      resolver: zodResolver(equityBackTestInputSchema),
      defaultValues: {
        symbols: selectedSymbol,
        selectedTabMode: "equity",
        selectedStrategy: "Select",
        datesRange: "",
        entryPositionSize: "Select",
        entryPositionSizeValue: 0,
        entryCriteria: entryCriteria,
      },
    });

  const {
    data: calculateQuery,
    isFetching: isLoadingQuery,
    refetch: refetchQuery,
  } = api.backtester.calculateEnquity.useQuery(resultForm, {
    enabled: resultForm ? true : false,
  });

  const router = useRouter();
  const backtesteId = router.query.id;
  let backtest = null;

  if (backtesteId) {
    const { data } = api.backtester.getBacktest.useQuery({
      id: Number(backtesteId),
    });
    backtest = data;
  }

  useEffect(() => {
    if (backtest) {
      const dataField = backtest.dataFields as EquityBackTestInput;
      if (dataField.selectedTabMode === "equity") {
        const [startDateLoaded, endDateLoaded] =
          dataField.datesRange.split("-");
        setStartDate(unFormatYear(startDateLoaded));
        setEndDate(unFormatYear(endDateLoaded));

        setValue("datesRange", dataField.datesRange);
        setValue("selectedStrategy", dataField.selectedStrategy);
        setValue("entryPositionSize", dataField.entryPositionSize);
        setValue("entryPositionSizeValue", dataField.entryPositionSizeValue);

        dataField.entryCriteria.forEach((item, i) => {
          setValue(
            `entryCriteria[${i}].positionCriteria` as entryCriteriaType,
            item.positionCriteria
          );
          setValue(
            `entryCriteria[${i}].positionValue` as entryCriteriaType,
            item.positionValue
          );
        });

        setEntryCriteria(dataField.entryCriteria);

        dataField.exitPositionSize &&
          setValue(
            "exitPositionSize" as entryCriteriaType,
            dataField.exitPositionSize
          );
        dataField.exitPositionSizeValue &&
          setValue(
            "exitPositionSizeValue" as entryCriteriaType,
            dataField.exitPositionSizeValue
          );

        if (dataField.exitAndCriteria) {
          dataField.exitAndCriteria.forEach((item, i) => {
            setValue(
              `exitAndCriteria[${i}].positionCriteria` as entryCriteriaType,
              item.positionCriteria
            );
            setValue(
              `exitAndCriteria[${i}].positionValue` as entryCriteriaType,
              item.positionValue
            );
          });

          setExitAndCriteria(dataField.exitAndCriteria);
        }

        if (dataField.exitOrCriteria) {
          dataField.exitOrCriteria.forEach((item, i) => {
            setValue(
              `exitOrCriteria[${i}].positionCriteria` as entryCriteriaType,
              item.positionCriteria
            );
            setValue(
              `exitOrCriteria[${i}].positionValue` as entryCriteriaType,
              item.positionValue
            );
          });

          setExitOrCriteria(dataField.exitOrCriteria);
        }

        dataField.resetStockPrice &&
          setValue("resetStockPrice", dataField.resetStockPrice);

        setResultForm(dataField);
        dataField["fromHistory"] = true;
        setIsFormSubmitted(true);
        dataField && refetchQuery(dataField);
      }
    }
  }, [backtest]);

  useEffect(() => {
    if (calculateQuery) {
      setBackTestCalc(calculateQuery);
    }
  }, [calculateQuery]);

  useEffect(() => {
    setEquityLoading(isLoadingQuery);
  }, [isLoadingQuery]);

  const validateForm = () => {
    if (watch("selectedStrategy") === "Select") {
      return false;
    }
    if (
      (selectedStrategy === "Buy & Sell" ||
        selectedStrategy === "Short & Buy Back") &&
      exitAndCriteria.some((criteria) => criteria.positionCriteria === "Select")
    ) {
      return false;
    }

    if (
      (selectedStrategy === "Buy & Sell" ||
        selectedStrategy === "Short & Buy Back") &&
      exitOrCriteria.some((criteria) => criteria.positionCriteria === "Select")
    ) {
      return false;
    }
    if (
      entryCriteria.some((criteria) => criteria.positionCriteria === "Select")
    ) {
      return false;
    }
    if (selectedSymbol.some((symbol) => symbol === "")) {
      toast.error("Please select the Symbol");
      return;
    }
    if (watch("selectedStrategy") === "Select" && isDateRangeSelected) {
      toast.error(
        "Please select a valid option for all strategy selections.",
        toastProps
      );
      return;
    }
    return true;
  };

  const onSubmit: SubmitHandler<EquityBackTestInput> = (data) => {
    const formData = {
      ...data,
      symbols: selectedSymbol,
      entryCriteria: entryCriteria.map((field) => ({
        positionCriteria: field.positionCriteria,
        positionValue: field.positionValue,
      })),
    };

    if (
      selectedStrategy === "Buy & Sell" ||
      selectedStrategy === "Short & Buy Back"
    ) {
      formData.exitPositionSize = data.exitPositionSize;
      formData.exitPositionSizeValue = data.exitPositionSizeValue;
      formData.exitAndCriteria = exitAndCriteria;
    }

    if (
      selectedStrategy === "Buy & Hold" ||
      selectedStrategy === "Short & Hold"
    ) {
      delete formData.exitPositionSize;
      delete formData.exitPositionSizeValue;
      delete formData.exitAndCriteria;
    }

    if (exitOrCriteria.length > 0) {
      formData.exitOrCriteria = exitOrCriteria;
    } else {
      delete formData.exitOrCriteria;
    }
    if (!validateForm()) {
      toast.error("Please select all the fields");
      return;
    }
    if (shouldRenderResetStockPrice) {
      formData.resetStockPrice = data.resetStockPrice;
      if (!formData.resetStockPrice) {
        toast.error("Please select the Reset Stock Price");
        return;
      }
    } else {
      delete formData.resetStockPrice;
    }
    setResultForm(formData);
    if (watch("selectedStrategy") === "Select" && isDateRangeSelected) {
      toast.error(
        "Please select a valid option for all strategy selections.",
        toastProps
      );
      return;
    }

    refetchQuery(formData as RefetchOptionsWithSymbols);
    setIsFormSubmitted(true);
  };

  const selectedStrategy = watch("selectedStrategy");

  return (
    <div className="text-xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className=" text-neutral-700"> Dates</label>
        <CustomDateRangePicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onChange={() => {
            if (startDate && endDate) {
              setValue(
                "datesRange",
                `${formatYear(startDate)} - ${formatYear(endDate)}`
              );
            }
          }}
        />
        <label htmlFor="strategySelections" className="text-neutral-700">
          Strategy
        </label>
        <div className="mb-3 mt-1 flex items-center gap-2">
          <Controller
            name="selectedStrategy"
            control={control}
            render={({ field }) => (
              <BackTestDropDown
                dropdownItems={dropdownItems}
                selectedItem={field.value}
                setSelectedItem={(selectedOption: string) =>
                  setValue("selectedStrategy", selectedOption)
                }
              />
            )}
          />
          <ExclamationCircleIcon className="h-6 w-6 text-gray-400" />
        </div>
        <div className=" my-3 w-full max-w-[307px] border-t border-gray-200"></div>
        {isDateRangeSelected && selectedStrategy !== "Select" && (
          <>
            <div>
              <p>Entry</p>
              <div className="mt-3 rounded-md border border-gray-300 bg-gray-50 p-2">
                <label htmlFor="sharePrice" className="text-neutral-700">
                  Position Size
                </label>
                <div>
                  <div className="my-1 flex items-center gap-2">
                    <div className="w-full max-w-[117px]">
                      <Controller
                        name="entryPositionSize"
                        control={control}
                        render={({ field }) => (
                          <BackTestDropDown
                            dropdownItems={positionSize}
                            selectedItem={field.value}
                            setSelectedItem={(selectedOption: string) =>
                              setValue("entryPositionSize", selectedOption)
                            }
                          />
                        )}
                      />
                    </div>
                    <span>is</span>
                    <div className="w-full max-w-[115px]">
                      <input
                        id="entryPositionValue"
                        type="number"
                        onWheel={(event) => event.currentTarget.blur()}
                        className="h-full max-h-7 w-full  max-w-[115px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
                        {...register("entryPositionSizeValue", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <ExclamationCircleIcon className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                <div>
                  {entryCriteria.map((field, index) => (
                    <div key={index}>
                      {index === 0 ? (
                        <label
                          htmlFor={`criteria_${index}`}
                          className="text-neutral-700"
                        >
                          Criteria
                        </label>
                      ) : (
                        <label
                          htmlFor={`criteria_${index}`}
                          className="text-neutral-700"
                        >
                          (and) Criteria
                        </label>
                      )}

                      <div className="my-1 flex items-center gap-2">
                        <div className="w-full max-w-[115px]">
                          <Controller
                            name={
                              `entryCriteria[${index}].positionCriteria` as entryCriteriaType
                            }
                            control={control}
                            render={({ field }) => (
                              <BackTestDropDown
                                dropdownItems={criteria}
                                selectedItem={field.value as string}
                                setSelectedItem={(selectedOption: string) => {
                                  setEntryCriteria((prevCriteria) => {
                                    const updatedCriteria = [...prevCriteria];
                                    updatedCriteria[index].positionCriteria =
                                      selectedOption;
                                    return updatedCriteria;
                                  });
                                  // Update form value
                                  setValue(
                                    `entryCriteria[${index}].positionCriteria` as entryCriteriaType,
                                    selectedOption
                                  );
                                }}
                              />
                            )}
                          />
                        </div>
                        <span>is</span>
                        <div className="w-full max-w-[117px]">
                          <input
                            type="number"
                            onWheel={(event) => event.currentTarget.blur()}
                            step="0.01"
                            className="h-full max-h-7 w-full max-w-[275px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
                            {...register(
                              `entryCriteria[${index}].positionValue` as entryCriteriaType,
                              {
                                valueAsNumber: true,
                              }
                            )}
                            onChange={(e) => {
                              const newValue = parseFloat(e.target.value);
                              setEntryCriteria((prevCriteria) => {
                                const updatedCriteria = [...prevCriteria];
                                updatedCriteria[index].positionValue = newValue;
                                return updatedCriteria;
                              });
                            }}
                          />
                        </div>
                        {index === 0 ? (
                          <ExclamationCircleIcon
                            onClick={() => removeCriteriaField(index)}
                            className="h-6 w-6 cursor-pointer text-gray-400"
                          />
                        ) : (
                          <TrashIcon
                            onClick={() => removeCriteriaField(index)}
                            className="h-6 w-6 cursor-pointer text-gray-400"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {entryCriteria.length > 4 ? null : (
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={addCriteriaField}
                        className="rounded-sm border border-gray-300 bg-gray-50 p-1"
                      >
                        <PlusIcon className="h-4 w-4 text-black" />
                      </button>
                      <span className="ml-2 text-xs font-normal text-[#505050]">
                        Add Criteria
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className=" my-3 w-full max-w-[307px] border-t border-gray-200"></div>
            {selectedStrategy === "Buy & Sell" ||
            selectedStrategy === "Short & Buy Back" ? (
              <div>
                <p>Exit</p>
                <div className="mt-3 rounded-md border border-gray-300 bg-gray-50 p-2">
                  <label htmlFor="sharePrice" className="text-neutral-700">
                    Position Size
                  </label>
                  <div>
                    <div className="my-1 flex items-center gap-2">
                      <div className="w-full max-w-[117px]">
                        <Controller
                          name="exitPositionSize"
                          control={control}
                          render={({ field }) => (
                            <BackTestDropDown
                              dropdownItems={positionSize}
                              selectedItem={field.value as string}
                              setSelectedItem={(selectedOption: string) =>
                                setValue("exitPositionSize", selectedOption)
                              }
                            />
                          )}
                        />
                      </div>
                      <span>is</span>
                      <div className="w-full max-w-[115px]">
                        <input
                          id="longPut"
                          type="number"
                          onWheel={(event) => event.currentTarget.blur()}
                          className="h-full max-h-7 w-full  max-w-[115px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
                          {...register("exitPositionSizeValue", {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <ExclamationCircleIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    {exitAndCriteria.map((field, index) => (
                      <div key={index}>
                        <label
                          htmlFor={`andCriteria_${index}`}
                          className="text-neutral-700"
                        >
                          And Criteria
                        </label>
                        <div className="my-1 flex items-center gap-2">
                          <div className="w-full max-w-[117px]">
                            <Controller
                              name={
                                `exitAndCriteria[${index}].positionCriteria` as exitAndCriteriaType
                              }
                              control={control}
                              render={({ field }) => (
                                <BackTestDropDown
                                  dropdownItems={criteria}
                                  selectedItem={field.value as string}
                                  setSelectedItem={(selectedOption: string) => {
                                    setExitAndCriteria((prevCriteria) => {
                                      const updatedCriteria = [...prevCriteria];
                                      updatedCriteria[index].positionCriteria =
                                        selectedOption;
                                      return updatedCriteria;
                                    });
                                    setValue(
                                      `exitAndCriteria[${index}].positionCriteria` as exitAndCriteriaType,
                                      selectedOption
                                    );
                                  }}
                                />
                              )}
                            />
                          </div>
                          <span>is</span>
                          <div className="w-full max-w-[115px]">
                            <input
                              type="number"
                              onWheel={(event) => event.currentTarget.blur()}
                              step="0.01"
                              className="h-full max-h-7 w-full max-w-[115px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
                              {...register(
                                `exitAndCriteria[${index}].positionValue` as exitAndCriteriaType,
                                {
                                  valueAsNumber: true,
                                }
                              )}
                              onChange={(e) => {
                                const newValue = parseFloat(e.target.value);
                                setExitAndCriteria((prevCriteria) => {
                                  const updatedCriteria = [...prevCriteria];
                                  updatedCriteria[index].positionValue =
                                    newValue;
                                  return updatedCriteria;
                                });
                              }}
                            />
                          </div>
                          {index === 0 ? (
                            <ExclamationCircleIcon className="h-6 w-6  text-gray-400" />
                          ) : (
                            <TrashIcon
                              onClick={() =>
                                removeExitCriteriaField(index, "and")
                              }
                              className="h-6 w-6 cursor-pointer text-gray-400"
                            />
                          )}
                        </div>
                      </div>
                    ))}

                    {exitOrCriteria.map((field, index) => (
                      <div key={index}>
                        <label
                          htmlFor={`orCriteria_${index}`}
                          className="text-neutral-700"
                        >
                          (or) Criteria
                        </label>
                        <div className="my-1 flex items-center gap-2">
                          <div className="w-full max-w-[117px]">
                            <Controller
                              name={
                                `exitOrCriteria[${index}].positionCriteria` as exitOrCriteriaType
                              }
                              control={control}
                              render={({ field }) => (
                                <BackTestDropDown
                                  dropdownItems={criteria}
                                  selectedItem={field.value as string}
                                  setSelectedItem={(selectedOption: string) => {
                                    setExitOrCriteria((prevCriteria) => {
                                      const updatedCriteria = [...prevCriteria];
                                      updatedCriteria[index].positionCriteria =
                                        selectedOption;
                                      return updatedCriteria;
                                    });
                                    // Update form value
                                    setValue(
                                      `exitOrCriteria[${index}].positionCriteria` as exitOrCriteriaType,
                                      selectedOption
                                    );
                                  }}
                                />
                              )}
                            />
                          </div>
                          <span>is</span>
                          <div className="w-full max-w-[117px]">
                            <input
                              type="number"
                              onWheel={(event) => event.currentTarget.blur()}
                              step="0.01"
                              className="h-full max-h-7 w-full max-w-[275px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
                              {...register(
                                `exitOrCriteria[${index}].positionValue` as exitOrCriteriaType,
                                {
                                  valueAsNumber: true,
                                }
                              )}
                              onChange={(e) => {
                                const newValue = parseFloat(e.target.value);
                                setExitOrCriteria((prevCriteria) => {
                                  const updatedCriteria = [...prevCriteria];
                                  updatedCriteria[index].positionValue =
                                    newValue;
                                  return updatedCriteria;
                                });
                              }}
                            />
                          </div>
                          <TrashIcon
                            onClick={() => removeExitCriteriaField(index, "or")}
                            className="h-6 w-6 cursor-pointer text-gray-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {exitAndCriteria.length + exitOrCriteria.length > 4 ? null : (
                    <div className="mt-2 flex items-center gap-12">
                      <div className="flex items-center">
                        <button
                          onClick={() => addExitCriteriaField("and")}
                          className="rounded-sm border border-gray-300 bg-gray-50 p-1"
                        >
                          <PlusIcon className="h-4 w-4 text-black" />
                        </button>
                        <span className="ml-2 text-xs font-normal text-[#505050]">
                          And Criteria
                        </span>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => addExitCriteriaField("or")}
                          className="rounded-sm border border-gray-300 bg-gray-50 p-1"
                        >
                          <PlusIcon className="h-4 w-4 text-black" />
                        </button>
                        <span className="ml-2 text-xs font-normal text-[#505050]">
                          Or Criteria
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            {shouldRenderResetStockPrice ? (
              <div className="mt-5">
                <label
                  htmlFor="strategySelections"
                  className="text-neutral-700"
                >
                  Reset Stock Price
                </label>
                <div className="mt-1 flex items-center justify-between">
                  <Controller
                    name="resetStockPrice"
                    control={control}
                    render={({ field }) => (
                      <BackTestDropDown
                        dropdownItems={resetStockPrice}
                        selectedItem={field.value as string}
                        setSelectedItem={(selectedOption: string) =>
                          setValue("resetStockPrice", selectedOption)
                        }
                      />
                    )}
                  />
                  <ExclamationCircleIcon className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            ) : null}
          </>
        )}
        <button
          className={`w-full rounded-lg py-3 text-white no-underline drop-shadow transition duration-150 ease-in-out ${
            watch("selectedStrategy") !== "Select" && validateForm()
              ? "bg-black"
              : "bg-gray-800 bg-opacity-20"
          } mb-8 mt-6`}
          type="submit"
          disabled={watch("selectedStrategy") === "Select" && !validateForm()}
        >
          Run Backtest
        </button>
      </form>
    </div>
  );
};

export default EquitySettingsForm;
