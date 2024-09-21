import React, { Fragment } from "react";
import { TradingStrategy } from "opcalc-database";
import { Popover, Transition } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { tradingStrategyFriendlyNames } from "./data";
import SymbolFilter from "../molecules/SymbolFilter";

const Filters: React.FC<Props> = ({
  tradingStrategies,
  setTradingStrategies,
  status,
  setStatus,
  symbol,
  setSymbol,
}) => {
  const areFiltersSet =
    tradingStrategies.length !== Object.values(TradingStrategy).length ||
    status.length !== Object.values(Status).length ||
    symbol !== undefined;
  return (
    <div className="flex items-center gap-3">
      <AdjustmentsHorizontalIcon className="h-5 w-5" />
      <Popover className="relative inline-block">
        <Popover.Button className="group inline-flex justify-center text-sm font-bold text-gray-700 hover:text-gray-900">
          <span>Strategies</span>
          <ChevronDownIcon
            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Popover.Panel className="absolute left-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <form className="space-y-4">
              {Object.values(TradingStrategy).map((tradingStrategy) => (
                <div key={tradingStrategy} className="flex items-center">
                  <input
                    id={tradingStrategy}
                    name={tradingStrategy}
                    defaultValue={tradingStrategy}
                    type="checkbox"
                    defaultChecked={tradingStrategies.includes(tradingStrategy)}
                    className="h-4 w-4 rounded border-gray-300 text-orange focus:ring-orange"
                    onChange={(event) =>
                      event.target.checked
                        ? setTradingStrategies((prev) => [
                            ...prev,
                            tradingStrategy,
                          ])
                        : setTradingStrategies((prev) =>
                            prev.filter(
                              (strategy) => strategy !== tradingStrategy
                            )
                          )
                    }
                  />
                  <label
                    htmlFor={tradingStrategy}
                    className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                  >
                    {tradingStrategyFriendlyNames[tradingStrategy]}
                  </label>
                </div>
              ))}
            </form>
          </Popover.Panel>
        </Transition>
      </Popover>
      <Popover className="relative inline-block">
        <Popover.Button className="group inline-flex justify-center text-sm font-bold text-gray-700 hover:text-gray-900">
          <span>Status</span>
          <ChevronDownIcon
            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Popover.Panel className="absolute left-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <form className="space-y-4">
              {Object.values(Status).map((statusOption) => (
                <div key={statusOption} className="flex items-center">
                  <input
                    id={statusOption}
                    name={statusOption}
                    defaultValue={statusOption}
                    type="checkbox"
                    defaultChecked={status.includes(statusOption)}
                    className="h-4 w-4 rounded border-gray-300 text-orange focus:ring-orange"
                    onChange={(event) =>
                      event.target.checked
                        ? setStatus((prev) => [...prev, statusOption])
                        : setStatus((prev) =>
                            prev.filter((status) => status !== statusOption)
                          )
                    }
                  />
                  <label
                    htmlFor={statusOption}
                    className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                  >
                    {statusOption}
                  </label>
                </div>
              ))}
            </form>
          </Popover.Panel>
        </Transition>
      </Popover>
      <Popover className="relative inline-block">
        <Popover.Button className="group inline-flex justify-center text-sm font-bold text-gray-700 hover:text-gray-900">
          <span>Ticker</span>
          <ChevronDownIcon
            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Popover.Panel className="absolute left-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
            <SymbolFilter
              onChange={(symbol) => setSymbol(symbol)}
              value={symbol ?? ""}
            />
          </Popover.Panel>
        </Transition>
      </Popover>
      {areFiltersSet && (
        <button
          className="text-sm font-bold text-orange underline"
          type="button"
          onClick={() => {
            setTradingStrategies(Object.values(TradingStrategy));
            setStatus(Object.values(Status));
            setSymbol(undefined);
          }}
        >
          Remove Filters
        </button>
      )}
    </div>
  );
};

type Props = {
  tradingStrategies: TradingStrategy[];
  setTradingStrategies: React.Dispatch<React.SetStateAction<TradingStrategy[]>>;
  status: Status[];
  setStatus: React.Dispatch<React.SetStateAction<Status[]>>;
  symbol?: string;
  setSymbol: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export enum Status {
  "Open" = "Open",
  "Closed" = "Closed",
}
export default Filters;
