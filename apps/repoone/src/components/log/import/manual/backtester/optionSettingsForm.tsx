import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Radio } from "flowbite-react";
import React, {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
} from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import BackTestDropDown from "~/components/FlowBite/backtester/BackTestDropDown";
import {
  type OptionBackTestInput,
  optionBackTestInputSchema,
} from "~/server/strategies/backtest";
import CustomDateRangePicker from "~/components/FlowBite/backtester/DateRangePicker";
import { formatYear, unFormatYear } from "~/utils/formatYear";
import IronCondor from "./optionForms/IronCondor";
import LongCall from "./optionForms/LongCall";
import LongPut from "./optionForms/LongPut";
import CallCreditSpread from "./optionForms/CallCreditSpread";
import CallDebitSpread from "./optionForms/CallDebitSpread";
import CashSecuredPut from "./optionForms/CashSecuredPut";
import PutDebitSpread from "./optionForms/PutDebitSpread";
import PutCreditSpread from "./optionForms/PutCreditSpread";
import NakedPut from "./optionForms/NakedPut";
import NakedCall from "./optionForms/NakedCall";
import PoorMansCovered from "./optionForms/PoorMansCovered";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { theme } from "./utils/style";
import { dropdownCloseOptions, dropdownOptionItems } from "./utils/dropdown";
import {
  type IExternalStrategiesForm,
  type RefetchOptionsWithSymbols,
} from "./utils/interfaces";
import { useRouter } from "next/router";

export type StrategyOptions = {
  strategyName?: string;
  strategyType?: string;
  strategyMode?: string;
  strategyValue?: number;
  strategyQuantity?: number;
};

type Props = {
  selectedSymbol: string[];
  backTestCalc: any;
  initialState: Partial<OptionBackTestInput>;
  setBackTestCalc: Dispatch<SetStateAction<any>>;
  setIsFormSubmitted: Dispatch<SetStateAction<boolean>>;
  setOptionsLoading: (val: boolean) => void;
};
const OptionSettingsForm = ({
  selectedSymbol,
  setBackTestCalc,
  setIsFormSubmitted,
  setOptionsLoading,
}: Props) => {
  const [loadedDataHistory, setLoadedDataHistory] = useState<
    StrategyOptions[] | null
  >(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [resultForm, setResultForm] = useState<any>(null);
  const [strategiesExternal, setExternalStrategies] = useState<
    IExternalStrategiesForm[]
  >([
    {
      strategyName: "",
      strategyType: "",
      strategyMode: "",
      strategyValue: 0,
      strategyQuantity: 1,
    },
  ]);
  const isDateRangeSelected =
    startDate !== null && endDate !== null && endDate >= startDate;
  const { register, handleSubmit, formState, control, watch, setValue } =
    useForm<OptionBackTestInput>({
      resolver: zodResolver(optionBackTestInputSchema),
      defaultValues: {
        symbols: selectedSymbol,
        selectedTabMode: "options",
        selectedStrategy: "Select",
        datesRange: "",
        expirationDays: 0,
        strategies: strategiesExternal,
        backtesterMode: "let_options_expire",
        closeOutCriteria: undefined,
        closeOutCriteriaValue: undefined,
      },
    });

  const {
    data: calculateQuery,
    isFetching: isLoadingQuery,
    refetch: refetchQuery,
  } = api.backtester.calculate.useQuery(resultForm, {
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
      const dataField = backtest.dataFields as OptionBackTestInput;
      if (dataField.selectedTabMode === "options") {
        const [startDateLoaded, endDateLoaded] =
          dataField.datesRange.split("-");
        setStartDate(unFormatYear(startDateLoaded));
        setEndDate(unFormatYear(endDateLoaded));

        setValue("datesRange", dataField.datesRange);
        setValue("selectedStrategy", dataField.selectedStrategy);

        setValue("closeOutCriteria", dataField.closeOutCriteria);
        setValue("closeOutCriteriaValue", dataField.closeOutCriteriaValue);

        setExternalStrategies(dataField.strategies);

        setValue("backtesterMode", dataField.backtesterMode);

        setLoadedDataHistory(dataField.strategies);

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
    setOptionsLoading(isLoadingQuery);
  }, [isLoadingQuery]);

  const isValidStrategies =
    strategiesExternal &&
    strategiesExternal.every((strategy) => {
      return strategy.strategyMode !== "";
    });

  useEffect(() => {
    if (backtest) {
      setValue("backtesterMode", backtest.dataFields.backtesterMode);
    } else {
      setValue("backtesterMode", "");
    }
  }, [watch("selectedStrategy"), backtest]);

  const isValidOTMStrategy = (strategy: IExternalStrategiesForm) => {
    return (
      strategy.strategyMode === "OTM %" &&
      (strategy.strategyValue < -99 || strategy.strategyValue > 100)
    );
  };

  const onSubmit: SubmitHandler<OptionBackTestInput> = async (data) => {
    for (const strategy of strategiesExternal) {
      if (isValidOTMStrategy(strategy)) {
        toast.error(
          "If strategyMode is 'OTM %', strategyValue must be between -99 (exclusive) and 100 (inclusive)."
        );
        return;
      }
    }

    setIsFormSubmitted(true);

    try {
      if (selectedSymbol.some((symbol) => symbol === "")) {
        toast.error("Please select the Symbol");
        return;
      }
      if (!isValidStrategies) {
        toast.error("Invalid strategy details");
        return;
      }
      if (data.backtesterMode === "") {
        toast.error("Invalid Mode");
        return;
      }
      setResultForm({
        ...data,
        strategies: strategiesExternal,
        symbols: selectedSymbol,
      });

      refetchQuery({
        symbols: selectedSymbol,
        selectedTabMode: "options",
        selectedStrategy: data.selectedStrategy,
        datesRange: data.datesRange,
        expirationDays: data.expirationDays,
        strategies: strategiesExternal,
        backtesterMode: data.backtesterMode,
        closeOutCriteria: data.closeOutCriteria,
        closeOutCriteriaValue: data.closeOutCriteriaValue,
      } as RefetchOptionsWithSymbols);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching data:", error);
    }
  };
  const activeButtonn = (string: string): boolean => {
    if (string === "disabled") {
      return (
        watch("selectedStrategy") === "Select" &&
        !formState.isValid &&
        !formState.dirtyFields &&
        !isValidStrategies &&
        watch("backtesterMode") === ""
      );
    }
    return (
      watch("selectedStrategy") !== "Select" &&
      formState.isValid &&
      formState.dirtyFields &&
      isValidStrategies &&
      watch("backtesterMode") !== ""
    );
  };

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
                dropdownItems={dropdownOptionItems}
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
            <div className=" my-3 w-full max-w-[300px] border-t border-gray-200"></div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-neutral-700">
                {" "}
                {watch("selectedStrategy")}
              </p>
              <label
                htmlFor="expirationDays"
                className="mb-1 mt-2  text-neutral-700"
              >
                Expiration (days)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="expirationDays"
                  type="number"
                  onWheel={(event) => event.currentTarget.blur()}
                  className="h-full max-h-7 w-full  max-w-[275px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
                  {...register("expirationDays", { valueAsNumber: true })}
                />
                <ExclamationCircleIcon className="h-6 w-6 text-gray-400" />
              </div>
              {watch("selectedStrategy") === "Iron Condor" && (
                <IronCondor
                  loadedStrategies={loadedDataHistory}
                  setExternalStrategies={setExternalStrategies}
                />
              )}
              {watch("selectedStrategy") === "Long Call" && (
                <LongCall
                  loadedStrategies={loadedDataHistory}
                  setExternalStrategies={setExternalStrategies}
                />
              )}
              {watch("selectedStrategy") === "Long Put" && (
                <LongPut
                  loadedStrategies={loadedDataHistory}
                  setExternalStrategies={setExternalStrategies}
                />
              )}
              {watch("selectedStrategy") === "Call Credit Spread" && (
                <CallCreditSpread
                  loadedStrategies={loadedDataHistory}
                  setExternalStrategies={setExternalStrategies}
                />
              )}

              {watch("selectedStrategy") === "Call Debit Spread" && (
                <CallDebitSpread
                  loadedStrategies={loadedDataHistory}
                  setExternalStrategies={setExternalStrategies}
                />
              )}

              {watch("selectedStrategy") === "Cash Secured Put" && (
                <CashSecuredPut
                  loadedStrategies={loadedDataHistory}
                  setExternalStrategies={setExternalStrategies}
                />
              )}

              {watch("selectedStrategy") === "Put Debit Spread" && (
                <PutDebitSpread
                  loadedStrategies={loadedDataHistory}
                  setExternalStrategies={setExternalStrategies}
                />
              )}

              {watch("selectedStrategy") === "Put Credit Spread" && (
                <PutCreditSpread
                  loadedStrategies={loadedDataHistory}
                  setExternalStrategies={setExternalStrategies}
                />
              )}

              {watch("selectedStrategy") === "Naked Put" && (
                <NakedPut
                  loadedStrategies={loadedDataHistory}
                  setExternalStrategies={setExternalStrategies}
                />
              )}
              {watch("selectedStrategy") === "Naked Call" && (
                <NakedCall
                  loadedStrategies={loadedDataHistory}
                  setExternalStrategies={setExternalStrategies}
                />
              )}

              {watch("selectedStrategy") === "Poor Man’s Cov Call" && (
                <PoorMansCovered
                  loadedStrategies={loadedDataHistory}
                  setExternalStrategies={setExternalStrategies}
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
                              setValue("closeOutCriteria", undefined);
                              setValue("closeOutCriteriaValue", undefined);
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
                            Let options expire worthless or get
                            assigned/exercised
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
                                selectedItem={field.value}
                                setSelectedItem={(selectedOption: string) =>
                                  setValue("closeOutCriteria", selectedOption)
                                }
                              />
                            )}
                          />
                        </div>
                        <div className="w-full max-w-[133px]">
                          <input
                            id="closeOutCriteriaValue"
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
            </div>
          </>
        )}
        <button
          className={`w-full rounded-lg py-3 text-white no-underline drop-shadow transition duration-150 ease-in-out ${
            activeButtonn("color") ? "bg-black" : "bg-gray-800 bg-opacity-20"
          } mb-8 mt-6`}
          type="submit"
          disabled={activeButtonn("disabled")}
        >
          Run Backtest
        </button>
      </form>
    </div>
  );
};

export default OptionSettingsForm;
