import { Tabs } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import {
  type OptionsEquityBackTestInput,
  type EquityBackTestInput,
  type OptionBackTestInput,
} from "~/server/strategies/backtest";
import BackTestResults from "./BackTestResults";
import OptionSettingsForm from "./backtester/optionSettingsForm";
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";
import EquitySettingsForm from "./backtester/equitySettingsForm";
import EquityAndOptionSettingsForm from "./backtester/equityAndOptionSettingForm";
import { SymbolAutocompleteBacktester } from "~/components/molecules/SymbolAutocompleteBacktester";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";

const BackTesterSettingForm: React.FC = () => {
  const matches = useMediaQueryCustom("(max-width: 768px)");

  const [optionBackTestForms] = useState<
    { id: number; initialState: Partial<OptionBackTestInput> }[]
  >([{ id: Math.random(), initialState: {} }]);
  const [equityBackTestForms] = useState<
    { id: number; initialState: Partial<EquityBackTestInput> }[]
  >([{ id: Math.random(), initialState: {} }]);
  const [equityAndOptionForms] = useState<
    { id: number; initialState: Partial<OptionsEquityBackTestInput> }[]
  >([{ id: Math.random(), initialState: {} }]);
  const [symbols, setSymbols] = useState<string[]>([""]);

  const handleAddSymbol = () => {
    if (symbols.length < 4) {
      setSymbols([...symbols, ""]);
    }
  };

  const router = useRouter();
  const backId = router.query.id;

  useEffect(() => {
    if (router.query.id && router.query.symbols && router.query.mode) {
      setSymbols((router.query.symbols as string).split("_"));
    }
  }, [backId]);

  const handleRemoveSymbol = (index: number) => {
    const updatedSymbols = [...symbols];
    updatedSymbols.splice(index, 1);
    setSymbols(updatedSymbols);
  };

  const handleSymbolChange = (index: number, symbol: string) => {
    const updatedSymbols = [...symbols];
    updatedSymbols[index] = symbol;
    setSymbols(updatedSymbols);
  };
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [backTestCalc, setBackTestCalc] = useState();
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [equityLoading, setEquityLoading] = useState(false);
  const [optionsEquityLoading, setOptionsEquityLoading] = useState(false);

  useEffect(() => {
    if (backTestCalc) {
      const backtestCalcResponse = backTestCalc as {
        data: { errorMessage: string; table_items: [] };
      };
      if (backtestCalcResponse.data.errorMessage) {
        toast.error(backtestCalcResponse.data.errorMessage, toastProps);
      } else if (!backtestCalcResponse.data.table_items) {
        toast.error("Something went wrong! Try again later.", toastProps);
      }
    }
  }, [backTestCalc]);

  const tabsTheme = {
    tablist: {
      base: "flex align-center",
      tabitem: {
        base: "flex items-center justify-center p-4 rounded-t-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 w-24",
        styles: {
          underline: {
            base: "rounded-t-lg",
            active: {
              on: "rounded-t-lg border-b-2 active border-black",
              off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
            },
          },
        },
      },
    },
  };

  return (
    <div>
      <div
        className={`${
          matches ? "w-full flex-col items-start" : "w-full items-center"
        } flex gap-1 rounded-lg bg-white p-3`}
      >
        {symbols.map((symbol, index) => (
          <div key={index} className="flex items-center gap-1">
            <SymbolAutocompleteBacktester
              value={symbol}
              onChange={(value) => handleSymbolChange(index, value)}
            />
            {index > 0 && (
              <MinusCircleIcon
                className="h-5 w-5"
                onClick={() => handleRemoveSymbol(index)}
              />
            )}
          </div>
        ))}
        {symbols.length < 4 && ( // Only show the plus icon if there are less than 4 symbols
          <PlusCircleIcon className="h-5 w-5" onClick={handleAddSymbol} />
        )}
      </div>
      <div
        className={`${matches ? "flex-col" : "flex"} mt-5 items-start gap-4 `}
      >
        <div
          className={`w-full ${
            matches ? "max-w-[90vw]" : "max-w-[324px]"
          }  rounded-lg bg-white p-2 font-semibold text-gray-800`}
        >
          <h3 className="py-3">Backtest Settings</h3>
          <div
            className={` w-full  ${
              matches ? "max-w-[90vw]" : "max-w-[324px]"
            } border-t border-gray-200`}
          ></div>
          <Tabs
            theme={tabsTheme}
            aria-label="Tabs with underline"
            style="underline"
            className="m-auto focus:outline-none"
          >
            <Tabs.Item active={router.query.mode === "options"} title="Options">
              {optionBackTestForms.map((form) => (
                <OptionSettingsForm
                  key={form.id}
                  selectedSymbol={symbols}
                  initialState={form.initialState}
                  backTestCalc={backTestCalc}
                  setBackTestCalc={setBackTestCalc}
                  setOptionsLoading={(val) => {
                    setOptionsLoading(val);
                  }}
                  setIsFormSubmitted={setIsFormSubmitted}
                />
              ))}
            </Tabs.Item>
            <Tabs.Item active={router.query.mode === "equity"} title="Equity">
              {equityBackTestForms.map((form) => (
                <EquitySettingsForm
                  key={form.id}
                  selectedSymbol={symbols}
                  initialState={form.initialState}
                  backTestCalc={backTestCalc}
                  setBackTestCalc={setBackTestCalc}
                  setEquityLoading={(val) => {
                    setEquityLoading(val);
                  }}
                  setIsFormSubmitted={setIsFormSubmitted}
                />
              ))}
            </Tabs.Item>
            <Tabs.Item
              active={router.query.mode === "equity-options"}
              title="Options&Equity"
            >
              {equityAndOptionForms.map((form) => (
                <EquityAndOptionSettingsForm
                  key={form.id}
                  initialState={form.initialState}
                  selectedSymbol={symbols}
                  backTestCalc={backTestCalc}
                  setBackTestCalc={setBackTestCalc}
                  setOptionsEquityLoading={setOptionsEquityLoading}
                  setIsFormSubmitted={setIsFormSubmitted}
                />
              ))}
            </Tabs.Item>
          </Tabs>
        </div>
        <BackTestResults
          backTestCalc={backTestCalc}
          optionsLoading={optionsLoading}
          equityLoading={equityLoading}
          optionsEquityLoading={optionsEquityLoading}
          isFormSubmitted={isFormSubmitted}
        />
      </div>
    </div>
  );
};

export default React.memo(BackTesterSettingForm);
