import { Fragment, useState, useRef } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { uniq } from "lodash";
import Image from "next/image";
const AutoCompleteBacktester: React.FC<Props> = ({
  options,
  onChange,
  value,
}) => {
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
      <div className="relative w-full max-w-[220px] cursor-default  rounded-md">
        <Combobox.Input
          className="inline-flex w-full max-w-[220px]  scale-[0.99] items-center justify-start gap-2.5 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 pl-10 focus:border-none focus:ring-1 focus:ring-black"
          onChange={(event) => setQuery(event.target.value)}
        />
        <Combobox.Button className="absolute inset-y-0 left-0 flex items-center pl-4">
          <Image
            src={"../../../icons/search-outline.svg"}
            alt="search"
            width={16}
            height={16}
          />
        </Combobox.Button>

        {value !== "" && (
          <Combobox.Button
            onClick={() => {
              onChange("");
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <Image
              src={"../../../icons/x-outline.svg"}
              alt="search"
              width={10}
              height={10}
            />
          </Combobox.Button>
        )}
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Combobox.Options className="absolute top-32 z-20  w-full max-w-[300px] rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                active ? "bg-black text-white" : "text-gray-900"
              }`
            }
          >
            {({ selected }) => (
              <div>
                <span className={`${selected ? "font-bold" : "font-normal"}`}>
                  {option.label}
                </span>
              </div>
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
                  active ? "bg-black text-white" : "text-gray-900"
                }`
              }
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {({ selected }) => (
                <div className="flex items-center gap-2">
                  <Image
                    src={"../../../icons/search-outline.svg"}
                    alt="search"
                    width={16}
                    height={16}
                  />
                  <span className={`${selected ? "font-bold" : "font-normal"}`}>
                    {filteredOptions[virtualRow.index].label}
                  </span>
                </div>
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

export default AutoCompleteBacktester;
