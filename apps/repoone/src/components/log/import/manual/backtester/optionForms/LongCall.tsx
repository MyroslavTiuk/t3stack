import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import BackTestDropDown from "~/components/FlowBite/backtester/BackTestDropDown";
import {
  type OptionBackTestInput,
  optionBackTestInputSchema,
} from "~/server/strategies/backtest";
import { type IExternalStrategiesForm } from "../utils/interfaces";
import { type StrategyFieldName } from "../utils/types";
import { dropdownLongPut } from "../utils/dropdown";
import { StrategyOptions } from "../optionSettingsForm";

type Props = {
  setExternalStrategies: (strategies: IExternalStrategiesForm[]) => void;
  loadedStrategies?: StrategyOptions[];
};

const LongCall = ({ setExternalStrategies, loadedStrategies }: Props) => {
  const defaultEmpty = [
    {
      strategyName: "long-call",
      strategyType: "call",
      strategyMode: "",
      strategyValue: 0,
      strategyQuantity: 1,
    },
  ];
  const values = loadedStrategies ?? defaultEmpty;
  const { register, control, watch, setValue } = useForm<OptionBackTestInput>({
    resolver: zodResolver(optionBackTestInputSchema),
    defaultValues: {
      strategies: values,
    },
  });

  const watchedStrategies = watch("strategies");

  useEffect(() => {
    setExternalStrategies(watchedStrategies);
  }, [watchedStrategies]);

  return (
    <>
      <p className="mb-2 mt-3 text-sm font-normal text-orange">Long Call</p>
      <label htmlFor="sharePrice" className="text-neutral-700">
        Entry Criteria
      </label>
      <div>
        <div className="flex items-center gap-2">
          <div className="w-full max-w-[133px]">
            <Controller
              name={`strategies[0].strategyMode` as StrategyFieldName}
              control={control}
              render={({ field }) => (
                <BackTestDropDown
                  dropdownItems={dropdownLongPut}
                  selectedItem={field.value as string}
                  setSelectedItem={(selectedOption: string) =>
                    setValue(
                      "strategies[0].strategyMode" as StrategyFieldName,
                      selectedOption
                    )
                  }
                />
              )}
            />
          </div>
          <div className="w-full max-w-[133px]">
            <input
              id="strategies[0].strategyValue"
              type="number"
              onWheel={(event) => event.currentTarget.blur()}
              step="0.01"
              className="h-full max-h-7 w-full  max-w-[275px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
              {...register("strategies[0].strategyValue" as StrategyFieldName, {
                valueAsNumber: true,
              })}
            />
          </div>

          <ExclamationCircleIcon className="h-6 w-6 text-gray-400" />
        </div>
        <div className="mt-1 w-full max-w-[180px]">
          <label
            htmlFor="strategies[0].strategyQuantity"
            className="text-neutral-700"
          >
            Quantity
          </label>

          <input
            id="strategies[0].strategyQuantity"
            type="number"
            onWheel={(event) => event.currentTarget.blur()}
            className="mt-1 h-full max-h-7  w-full max-w-[133px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
            {...register(
              "strategies[0].strategyQuantity" as StrategyFieldName,
              {
                valueAsNumber: true,
              }
            )}
          />
          <span className="ml-2 font-normal"> x 100</span>
        </div>
      </div>
    </>
  );
};

export default LongCall;
