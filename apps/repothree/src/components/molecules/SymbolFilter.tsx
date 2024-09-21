import React, { Fragment, useMemo, useState } from "react";

import { type TickerSymbol, getSortedSymbols } from "~/data/symbols";
// @ts-ignore
import { Options } from "../atoms/Autocomplete";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { uniq } from "lodash";

function getOptionLabel(symbol: TickerSymbol) {
  return `${symbol.symbol} - ${symbol.name}`;
}

const SymbolFilter: React.FC<Props> = ({ onChange, value }) => {
  const options = useMemo(() => {
    const sortedSymbols = getSortedSymbols();

    return sortedSymbols.map((symbol) => ({
      id: symbol.symbol,
      label: getOptionLabel(symbol),
    }));
  }, []);

  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : uniq([
          ...options.filter((option) =>
            option.label.toLowerCase().startsWith(query.toLowerCase())
          ),
          ...options.filter((option) =>
            option.label.toLowerCase().includes(query.toLowerCase())
          ),
        ]);

  return (
    <Combobox onChange={onChange} value={value}>
      <div className="flex">
        <div className="relative cursor-default overflow-hidden rounded-md">
          <Combobox.Input
            className="p2 rounded-md"
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center ">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-600"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <button onClick={() => onChange(undefined)}>
          <XMarkIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
        </button>
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Combobox.Options className="w-64 rounded-md bg-white py-1 focus:outline-none sm:text-sm">
          <Options
            filteredOptions={filteredOptions}
            totalNumber={options.length}
          />
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
};

type Props = {
  onChange: (id: string | undefined) => void;
  value: string;
};

export default SymbolFilter;
