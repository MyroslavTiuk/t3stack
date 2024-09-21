import React from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const SelectTemplate: React.FC<Props> = ({
  exampleCsvEntries,
  onChange,
  value,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <RadioGroup onChange={onChange} value={value}>
        <RadioGroup.Label className="flex justify-center">
          Template Value
        </RadioGroup.Label>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {exampleCsvEntries.map((csvEntry) => (
            <RadioGroup.Option
              key={csvEntry}
              value={csvEntry}
              className={({ active }) =>
                `${
                  active
                    ? "border-orange ring-2 ring-orange"
                    : "border-gray-300"
                } relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none`
              }
            >
              {({ checked, active }) => (
                <div className="flex items-center gap-2">
                  <RadioGroup.Label className="cursor-pointer font-bold">
                    {csvEntry}
                  </RadioGroup.Label>
                  <CheckCircleIcon
                    className={`${
                      !checked ? "invisible" : ""
                    } h-5 w-5 max-w-fit text-orange`}
                    aria-hidden="true"
                  />
                  <span
                    className={`${active ? "border" : "border-2"}
              ${checked ? "border-orange" : "border-transparent"} 
              pointer-events-none absolute -inset-px rounded-lg`}
                    aria-hidden="true"
                  />
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

type Props = {
  exampleCsvEntries: string[];
  onChange: (value: string) => void;
  value: string;
};

export default SelectTemplate;
