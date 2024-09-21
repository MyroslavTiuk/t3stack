/* eslint-disable no-console */
import {
  ExclamationCircleIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
} from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BackTestDropDown from "~/components/FlowBite/backtester/BackTestDropDown";

import CustomDateRangePicker from "~/components/FlowBite/backtester/DateRangePicker";
import { formatYear, unFormatYear } from "~/utils/formatYear";
import { Radio } from "flowbite-react";
import { theme } from "./utils/style";
import {
  criteria,
  dropdownOptionEquityItems,
  resetStockPrice,
  showResetStockPrice,
} from "./utils/dropdown";
import { api } from "~/utils/api";
import {
  type OptionsEquityBackTestInput,
  optionsEquityBackTestInputSchema,
} from "~/server/strategies/backtest";
import { type RefetchOptions } from "@tanstack/react-query";
import {
  type entryCriteriaType,
  type exitAndCriteriaType,
  type exitOrCriteriaType,
} from "./utils/types";
import CoveredCall from "./equityAndOptionsForms/CoveredCall";
import { MarriedPut } from "./equityAndOptionsForms/MarriedPut";
import {
  type ICriterias,
  type IExternalStrategiesForm,
} from "./utils/interfaces";
import { useRouter } from "next/router";

type Props = {
  selectedSymbol: string[];
  backTestCalc: any;
  initialState: Partial<OptionsEquityBackTestInput>;
  setBackTestCalc: Dispatch<SetStateAction<any>>;
  setIsFormSubmitted: Dispatch<SetStateAction<boolean>>;
  setOptionsEquityLoading: Dispatch<SetStateAction<boolean>>;
};
interface RefetchOptionsWithSymbols extends RefetchOptions {
  symbols: string[]; // Assuming symbols is an array of strings
}
const EquityAndOptionSettingsForm = ({
  selectedSymbol,
  setBackTestCalc,
  setIsFormSubmitted,
  setOptionsEquityLoading,
}: Props) => {
  const [loadedDataHistory, setLoadedDataHistory] = useState<any>(null);
  const [loadedExpirationDays, setLoadedExpirationDays] = useState<
    number | null
  >(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [expirationDays, setExpirationDays] = useState<number>(0);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showExitSection, setShowExitSection] = useState<boolean>(false);
  const [strategiesExternal, setExternalStrategies] =
    useState<IExternalStrategiesForm>({
      strategyName: "",
      strategyType: "",
      strategyMode: "",
      strategyValue: 0,
      strategyQuantity: 1,
    });
  const [resultForm, setResultForm] = useState<any>(null);

  const [entryCriteria, setEntryCriteria] = useState<ICriterias[]>([
    {
      positionCriteria: "Select",
      positionValue: 0,
    },
  ]);
  const [exitAndCriteria, setExitAndCriteria] = useState<ICriterias[]>([
    {
      positionCriteria: "Select",
      positionValue: 0,
    },
  ]);
  const [exitOrCriteria, setExitOrCriteria] = useState<ICriterias[]>([]);

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
      return updatedFields;
    });
  };

  const dropdownCloseOptions = ["DTE", "VIX Increases", "Stock Increases"];
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
    } else {
      setExitOrCriteria((prevFields) => {
        const updatedFields = [...prevFields];
        updatedFields.splice(index, 1);
        return updatedFields;
      });
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
    useForm<OptionsEquityBackTestInput>({
      resolver: zodResolver(optionsEquityBackTestInputSchema),
      defaultValues: {
        symbols: selectedSymbol,
        selectedTabMode: "equity-options",
        selectedStrategy: "Select",
        datesRange: "",
        entryPositionSize: "",
        entryPositionSizeValue: 0,
        entryCriteria: [
          {
            positionCriteria: "",
            positionValue: 0,
          },
        ],
        strategy: strategiesExternal,
        expirationDays: 0,
        resetStockPrice: "",
        backtesterMode: "",
        closeOutCriteria: undefined,
        closeOutCriteriaValue: undefined,
      },
    });
  const validateForm = () => {
    if (
      entryCriteria.some((criteria) => criteria.positionCriteria === "Select")
    ) {
      return false;
    }
    if (selectedSymbol.some((symbol) => symbol === "")) {
      return false;
    }
    if (watch("selectedStrategy") === "Select" && isDateRangeSelected) {
      return false;
    }
    if (strategiesExternal.strategyMode === "") {
      return false;
    }
    if (watch("backtesterMode") === "") {
      return false;
    }

    return true;
  };
  const isValidOTMStrategy = (strategyMode: string, strategyValue: number) => {
    return (
      strategyMode === "OTM %" && (strategyValue < -99 || strategyValue > 100)
    );
  };
  const {
    data: calculateQuery,
    isFetching: isLoadingQuery,
    refetch: refetchQuery,
  } = api.backtester.calculateEnquityOptions.useQuery(resultForm, {
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
      const dataField = backtest.dataFields as OptionsEquityBackTestInput;
      if (dataField.selectedTabMode === "equity-options") {
        const [startDateLoaded, endDateLoaded] =
          dataField.datesRange.split("-");
        setStartDate(unFormatYear(startDateLoaded));
        setEndDate(unFormatYear(endDateLoaded));

        setValue("datesRange", dataField.datesRange);
        setValue("selectedStrategy", dataField.selectedStrategy);

        setValue("entryPositionSize", dataField.entryPositionSize);
        setValue("entryPositionSizeValue", dataField.entryPositionSizeValue);

        if (dataField.entryCriteria) {
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
        }

        if (dataField.exitPositionSize && dataField.exitPositionSizeValue) {
          setValue("exitPositionSize", dataField.exitPositionSize);
          setValue("exitPositionSizeValue", dataField.exitPositionSizeValue);
        }

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

        dataField.backtesterMode &&
          setValue("backtesterMode", dataField.backtesterMode);

        dataField.closeOutCriteria &&
          setValue("closeOutCriteria", dataField.closeOutCriteria);
        dataField.closeOutCriteriaValue &&
          setValue("closeOutCriteriaValue", dataField.closeOutCriteriaValue);

        dataField.expirationDays && setExpirationDays(dataField.expirationDays);
        dataField.strategy && setExternalStrategies(dataField.strategy);

        setLoadedDataHistory(dataField.strategy);

        dataField.expirationDays &&
          setLoadedExpirationDays(dataField.expirationDays);

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
    setOptionsEquityLoading(isLoadingQuery);
  }, [isLoadingQuery]);

  useEffect(() => {
    if (backtest) {
      setValue("backtesterMode", backtest.dataFields.backtesterMode);
    } else {
      setValue("backtesterMode", "");
    }
  }, [watch("selectedStrategy"), backtest]);

  const onSubmit: SubmitHandler<OptionsEquityBackTestInput> = (data) => {
    const formData = {
      ...data,
      symbols: selectedSymbol,
      strategy: strategiesExternal,
      expirationDays: expirationDays,
      entryCriteria: entryCriteria.map((field) => ({
        positionCriteria: field.positionCriteria,
        positionValue: field.positionValue,
      })),
    };

    if (showExitSection) {
      formData.exitPositionSize = data.exitPositionSize;
      formData.exitPositionSizeValue = data.exitPositionSizeValue;
      formData.exitAndCriteria = exitAndCriteria;
      if (exitOrCriteria.length > 0) {
        formData.exitOrCriteria = exitOrCriteria;
      } else {
        delete formData.exitOrCriteria;
      }
    } else {
      delete formData.exitPositionSize;
      delete formData.exitPositionSizeValue;
      delete formData.exitAndCriteria;
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

    if (
      isValidOTMStrategy(
        data.strategy.strategyMode,
        data.strategy.strategyValue
      )
    ) {
      toast.error(
        "If strategyMode is 'OTM %', strategyValue must be between -99 (exclusive) and 100 (inclusive)."
      );
      return;
    }

    if (!validateForm()) {
      toast.error("Please select all the fields");
      return;
    }
    if (strategiesExternal.strategyMode === "") {
      toast.error("Invalid strategy details");
      return;
    }
    if (data.backtesterMode === "") {
      toast.error("Invalid Mode");
      return;
    }
    watch("backtesterMode") === "let_options_expire" &&
      delete formData.closeOutCriteria &&
      delete formData.closeOutCriteriaValue;

    setResultForm(formData);
    refetchQuery(formData as RefetchOptionsWithSymbols);
    setIsFormSubmitted(true);
  };

  const positionSize = ["Shares amount", "Dollar amount"];

  return (
    <div className="text-xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="selectedStrategy" className=" text-neutral-700">
          Strategy
        </label>
        <div className="mb-3 mt-1 flex items-center gap-2">
          <Controller
            name="selectedStrategy"
            control={control}
            render={({ field }) => (
              <BackTestDropDown
                dropdownItems={dropdownOptionEquityItems}
                selectedItem={field.value}
                setSelectedItem={(selectedOption: string) =>
                  setValue("selectedStrategy", selectedOption)
                }
              />
            )}
          />
          <ExclamationCircleIcon className="h-6 w-6 text-gray-400" />
        </div>
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
        {isDateRangeSelected && watch("selectedStrategy") !== "Select" && (
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
                        id="entryPositionSizeValue"
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
                        <div className="w-full max-w-[117px]">
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

            {showExitSection ? (
              <div>
                <div className="flex items-center justify-between">
                  <p>Exit</p>

                  <XCircleIcon
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => setShowExitSection(false)}
                  />
                </div>
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
                      <div className="w-full max-w-[117px]">
                        <input
                          id="exitPositionSizeValue"
                          type="number"
                          onWheel={(event) => event.currentTarget.blur()}
                          className="h-full max-h-7 w-full  max-w-[275px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
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
                                `exitAndCriteria[${index}].positionCriteria` as exitOrCriteriaType
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
                                    // Update form value
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
                          <div className="w-full max-w-[117px]">
                            <input
                              id={`exitAndCriteriaValue_${index}`}
                              type="number"
                              onWheel={(event) => event.currentTarget.blur()}
                              step="0.01"
                              className="h-full max-h-7 w-full max-w-[275px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
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
                              id={`exitOrCriteriaValue${index}`}
                              type="number"
                              onWheel={(event) => event.currentTarget.blur()}
                              step="0.01"
                              className="h-full max-h-7 w-full max-w-[275px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
                              {...register(
                                `exitOrCriteriaValue[${index}].positionValue` as exitOrCriteriaType,
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
            ) : (
              <div>
                <div className="flex items-center">
                  <button
                    onClick={() => setShowExitSection(true)}
                    className="rounded-sm border border-gray-300 bg-gray-50 p-1"
                  >
                    <PlusIcon className="h-4 w-4 text-black" />
                  </button>
                  <span className="ml-2 text-xs font-normal text-[#505050]">
                    Add Exit criteria
                  </span>
                </div>
              </div>
            )}

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
            {watch("selectedStrategy") === "Covered Call" && (
              <CoveredCall
                setExpirationDays={setExpirationDays}
                setExternalStrategies={setExternalStrategies}
                loadedStrategy={loadedDataHistory}
                loadedExpirationDays={loadedExpirationDays}
                setLoadedExpirationDays={(days) => {
                  setLoadedExpirationDays(days);
                }}
              />
            )}
            {watch("selectedStrategy") === "Married Put" && (
              <MarriedPut
                setExpirationDays={setExpirationDays}
                setExternalStrategies={setExternalStrategies}
                loadedStrategy={loadedDataHistory}
                setLoadedExpirationDays={(days) => {
                  setLoadedExpirationDays(days);
                }}
                loadedExpirationDays={loadedExpirationDays}
              />
            )}
            <div>
              <div className=" my-3 w-full max-w-[300px] border-t border-gray-200"></div>
              <div className="flex items-start justify-between">
                <div className="flex-col">
                  <Controller
                    name="backtesterMode"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Radio
                          theme={theme}
                          className="mb-1"
                          id="backtesterMode"
                          name="backtesterMode"
                          value="let_options_expire"
                          checked={field.value === "let_options_expire"}
                          onChange={() => {
                            setValue("backtesterMode", "let_options_expire");
                          }}
                        />
                        <label
                          htmlFor="backtesterMode"
                          className="ml-2 font-medium"
                        >
                          Let options expire
                        </label>
                        <p className="mb-3 ml-6 w-full max-w-[120px] text-[10px] font-normal">
                          Let options expire worthless or get assigned/exercised
                        </p>
                      </div>
                    )}
                  />
                </div>
                <div className="flex-col items-center gap-2">
                  <Controller
                    name="backtesterMode"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Radio
                          theme={theme}
                          className="mb-1"
                          id="close_out_options"
                          name="backtesterMode"
                          value="close_out_options"
                          checked={field.value === "close_out_options"}
                          onChange={() =>
                            setValue("backtesterMode", "close_out_options")
                          }
                        />
                        <label
                          htmlFor="close_out_options"
                          className="ml-2 font-medium"
                        >
                          Close out options
                        </label>
                        <p className=" ml-6 w-full max-w-[127px] text-[10px] font-normal">
                          Close out options before expiration
                        </p>
                      </div>
                    )}
                  />
                </div>
              </div>
              {watch("backtesterMode") === "close_out_options" && (
                <div>
                  <label
                    htmlFor="closeOutCriteria"
                    className="text-neutral-700"
                  >
                    Close Out Criteria
                  </label>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-full max-w-[133px]">
                        <Controller
                          name="closeOutCriteria"
                          control={control}
                          render={({ field }) => (
                            <BackTestDropDown
                              dropdownItems={dropdownCloseOptions}
                              selectedItem={field.value as string}
                              setSelectedItem={(selectedOption: string) =>
                                setValue("closeOutCriteria", selectedOption)
                              }
                            />
                          )}
                        />
                      </div>
                      <div className="w-full max-w-[133px]">
                        <input
                          id=" closeOutCriteriaValue"
                          type="number"
                          onWheel={(event) => event.currentTarget.blur()}
                          className="h-full max-h-7 w-full  max-w-[275px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
                          {...register("closeOutCriteriaValue", {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <ExclamationCircleIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <button
          className={`w-full rounded-lg py-3 text-white no-underline drop-shadow transition duration-150 ease-in-out ${
            watch("selectedStrategy") !== "Select" && validateForm()
              ? "bg-black"
              : "bg-gray-800 bg-opacity-20"
          } mb-8 mt-6`}
          type="submit"
          disabled={watch("selectedStrategy") === "Select" || !validateForm()}
        >
          Run Backtest
        </button>
      </form>
    </div>
  );
};

export default EquityAndOptionSettingsForm;
