import { Fragment, useState, useRef } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useVirtualizer } from "@tanstack/react-virtual";
import { uniq } from "lodash";

const Autocomplete: React.FC<Props> = ({ options, onChange, value }) => {
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
      <div className="relative w-full cursor-default overflow-hidden rounded-md">
        <Combobox.Input
          className="p2 w-20 rounded-md"
          onChange={(event) => setQuery(event.target.value)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-600"
            aria-hidden="true"
          />
        </Combobox.Button>
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery("")}
      >
        <Combobox.Options className="absolute z-10 mt-16 w-64 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <Options
            filteredOptions={filteredOptions}
            totalNumber={options.length}
          />
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
};

export const Options: React.FC<{
  filteredOptions: { id: string; label: string }[];
  totalNumber: number;
}> = ({ filteredOptions, totalNumber }) => {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: totalNumber,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  if (filteredOptions.length === 0) {
    return <p>No options found.</p>;
  }

  return (
    <div className="max-h-60 overflow-auto" ref={parentRef}>
      {filteredOptions.length < 10 ? (
        filteredOptions.map((option) => (
          <Combobox.Option
            key={option.id}
            value={option.id}
            className={({ active }) =>
              `w-full cursor-default select-none p-2 ${
                active ? "bg-orange text-white" : "text-gray-900"
              }`
            }
          >
            {({ selected }) => (
              <span className={`${selected ? "font-bold" : "font-normal"}`}>
                {option.label}
              </span>
            )}
          </Combobox.Option>
        ))
      ) : (
        <div
          className="relative"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <Combobox.Option
              key={virtualRow.index}
              value={filteredOptions[virtualRow.index].id}
              // value={virtualRow.index}
              className={({ active }) =>
                `absolute left-0 top-0 w-full cursor-default select-none p-2 ${
                  active ? "bg-orange text-white" : "text-gray-900"
                }`
              }
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {({ selected }) => (
                <span className={`${selected ? "font-bold" : "font-normal"}`}>
                  {filteredOptions[virtualRow.index].label}
                </span>
              )}
            </Combobox.Option>
          ))}
        </div>
      )}
    </div>
  );
};

type Props = {
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
  value: string;
};

export default Autocomplete;
