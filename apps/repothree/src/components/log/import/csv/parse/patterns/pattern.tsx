import React from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

import {
  PATTERNS,
  PATTERNS_DISPLAY_NAME,
  propertyPatterns,
  type Property,
  type MappedProperties,
} from "../../data";
import { ExtractFromString } from "./extractFromString/extractFromString";
import { Sum } from "./sum";
import { Includes } from "./includes";
import produce from "immer";

export const Pattern: React.FC<Props> = ({
  mappedProperties,
  setMappedProperties,
  property,
  originalColumnNames,
  csvArray,
}) => {
  return (
    <div className="flex flex-col gap-4 py-2">
      <RadioGroup
        onChange={(pattern) =>
          setMappedProperties((prev) =>
            produce(prev, (draft) => {
              draft[property].pattern = pattern;
            })
          )
        }
        value={mappedProperties[property].pattern}
      >
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {propertyPatterns[property].map((pattern) => (
            <RadioGroup.Option
              key={pattern}
              value={pattern}
              className={({ active }) =>
                `${
                  active
                    ? "border-orange ring-2 ring-orange"
                    : "border-gray-300"
                } relative flex w-64 cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none`
              }
            >
              {({ checked, active }) => (
                <div className="flex items-center gap-1">
                  <RadioGroup.Label className="cursor-pointer font-bold">
                    {PATTERNS_DISPLAY_NAME[pattern]}
                  </RadioGroup.Label>
                  <CheckCircleIcon
                    className={`${
                      !checked ? "invisible" : ""
                    } h-5 w-5 text-orange`}
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
      {mappedProperties[property].pattern === PATTERNS.extractFromString && (
        <ExtractFromString
          property={property}
          csvArray={csvArray}
          mappedProperties={mappedProperties}
          setMappedProperties={setMappedProperties}
        />
      )}
      {mappedProperties[property].pattern === PATTERNS.sum && (
        <Sum
          property={property}
          originalColumnNames={originalColumnNames}
          mappedProperties={mappedProperties}
          setMappedProperties={setMappedProperties}
        />
      )}
      {mappedProperties[property].pattern === PATTERNS.includes && (
        <Includes
          property={property}
          mappedProperties={mappedProperties}
          setMappedProperties={setMappedProperties}
        />
      )}
    </div>
  );
};

type Props = {
  csvArray: { [key: string]: string | null }[];
  mappedProperties: MappedProperties;
  setMappedProperties: React.Dispatch<React.SetStateAction<MappedProperties>>;
  property: Property;
  originalColumnNames: string[];
};
