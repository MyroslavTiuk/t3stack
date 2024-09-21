import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import BackTestDropDown from "~/components/FlowBite/backtester/BackTestDropDown";
import {
  type OptionsEquityBackTestInput,
  optionsEquityBackTestInputSchema,
} from "~/server/strategies/backtest";
import { dropdownLongPut } from "../utils/dropdown";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { type IExternalStrategiesForm } from "../utils/interfaces";

type Props = {
  setExternalStrategies: (strategies: IExternalStrategiesForm) => void;
  setExpirationDays: (expirationDays: number) => void;
  loadedStrategy?: {
    strategyName: string;
    strategyType: string;
    strategyMode: string;
    strategyValue: number;
    strategyQuantity: number;
  };
  loadedExpirationDays?: number;
  setLoadedExpirationDays?: (val: number) => void;
};

const CoveredCall = ({
  setExpirationDays,
  setExternalStrategies,
  loadedStrategy,
  loadedExpirationDays,
  setLoadedExpirationDays,
}: Props) => {
  const defaultEmpty = {
    strategyName: "long-put",
    strategyType: "put",
    strategyMode: "",
    strategyValue: 0,
    strategyQuantity: 1,
  };
  const values = loadedStrategy ?? defaultEmpty;
  const { register, control, watch, setValue } =
    useForm<OptionsEquityBackTestInput>({
      resolver: zodResolver(optionsEquityBackTestInputSchema),
      defaultValues: {
        strategy: values,
      },
    });

  const watchedStrategies = watch("strategy");
  const expirationDays = watch("expirationDays");

  useEffect(() => {
    setExpirationDays(expirationDays);
    setExternalStrategies(watchedStrategies);
  }, [watchedStrategies, expirationDays]);

  return (
    <>
      <h3 className="my-3 text-[15px]">Options Section</h3>

      <p className="mb-2 mt-3 text-sm font-normal text-orange">Short Call</p>
      <div className="my-2">
        <label htmlFor="expirationDays" className="text-neutral-700">
          Expiration (days)
        </label>
        <input
          id="expirationDays"
          type="number"
          value={loadedExpirationDays ?? 7}
          onWheel={(event) => event.currentTarget.blur()}
          className="mt-1 h-full max-h-7 w-full  max-w-[275px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
          {...register("expirationDays", { valueAsNumber: true })}
          onChange={(e) => {
            setLoadedExpirationDays(Number(e.currentTarget.value));
          }}
        />
      </div>
      <div>
        <label htmlFor="sharePrice" className="text-neutral-700">
          Entry Criteria
        </label>
        <div>
          <div className="flex items-center gap-2">
            <div className="w-full max-w-[133px]">
              <Controller
                name="strategy.strategyMode"
                control={control}
                render={({ field }) => (
                  <BackTestDropDown
                    dropdownItems={dropdownLongPut}
                    selectedItem={field.value}
                    setSelectedItem={(selectedOption: string) =>
                      setValue("strategy.strategyMode", selectedOption)
                    }
                  />
                )}
              />
            </div>
            <div className="w-full max-w-[133px]">
              <input
                id="strategy.strategyValue"
                type="number"
                onWheel={(event) => event.currentTarget.blur()}
                step="0.01"
                className="h-full max-h-7 w-full  max-w-[275px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
                {...register("strategy.strategyValue", {
                  valueAsNumber: true,
                })}
              />
            </div>
            <ExclamationCircleIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="mt-1 w-full max-w-[180px]">
            <label htmlFor="strategyQuantity" className="text-neutral-700">
              Quantity
            </label>

            <input
              id="strategy.strategyQuantity"
              type="number"
              value="1"
              onWheel={(event) => event.currentTarget.blur()}
              className="mt-1 h-full max-h-7  w-full max-w-[133px] rounded-lg border-gray-300 bg-gray-50 text-xs font-normal text-[#505050]"
              {...register("strategy.strategyQuantity", {
                valueAsNumber: true,
              })}
            />
            <span className="ml-2 font-normal"> x 100</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoveredCall;
