import React from "react";
import {
  propertyToEnum,
  type MappedProperties,
  type Property,
  DefaultBehavior,
} from "../../data";
import produce from "immer";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { map } from "lodash";
import type { OptionAction, OptionType, Position } from "trackgreeks-database";

export const Includes: React.FC<Props> = ({
  property,
  mappedProperties,
  setMappedProperties,
}) => {
  if (
    !(
      property === "position" ||
      property === "optionType" ||
      property === "expiry"
    )
  ) {
    return null;
  }
  const propertyEnum = propertyToEnum[property];

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    value:
      | keyof typeof Position
      | keyof typeof OptionType
      | keyof typeof OptionAction
  ) {
    setMappedProperties((prev) => {
      const firstIncludePattern =
        value === propertyEnum[0].enumValue
          ? event.target.value
          : prev[property].parameters.firstIncludePattern;
      const secondIncludePattern =
        value === propertyEnum[1].enumValue
          ? event.target.value
          : prev[property].parameters.secondIncludePattern;

      return produce(prev, (draft) => {
        draft[property].parameters.firstIncludePattern = firstIncludePattern;
        draft[property].parameters.secondIncludePattern = secondIncludePattern;
        draft[property].action = (input: string | null) => {
          if (isPatternInInput(firstIncludePattern, input)) {
            return propertyEnum[0].enumValue;
          }
          if (isPatternInInput(secondIncludePattern, input)) {
            return propertyEnum[1].enumValue;
          }

          if (
            prev[property].parameters.defaultBehavior ===
            DefaultBehavior.useFirst
          ) {
            return propertyEnum[0].enumValue;
          }
          if (
            prev[property].parameters.defaultBehavior ===
            DefaultBehavior.useSecond
          ) {
            return propertyEnum[1].enumValue;
          }
          return null;
        };
      });
    });
  }

  function handleDefaultChange(value: DefaultBehavior) {
    setMappedProperties((prev) => {
      return produce(prev, (draft) => {
        draft[property].parameters.defaultBehavior = value;
        draft[property].action = (input: string | null) => {
          if (
            isPatternInInput(
              prev[property].parameters.firstIncludePattern,
              input
            )
          ) {
            return propertyEnum[0].enumValue;
          }
          if (
            isPatternInInput(
              prev[property].parameters.secondIncludePattern,
              input
            )
          ) {
            return propertyEnum[1].enumValue;
          }

          if (value === DefaultBehavior.useFirst) {
            return propertyEnum[0].enumValue;
          }
          if (value === DefaultBehavior.useSecond) {
            return propertyEnum[1].enumValue;
          }
          return null;
        };
      });
    });
  }

  return (
    <>
      {propertyEnum.map(({ description, enumValue }, idx) => (
        <div className="flex flex-col gap-1" key={enumValue}>
          <label htmlFor="description" className="text-neutral-700">
            {description}
          </label>
          <input
            type="text"
            className="w-32 rounded-md"
            onChange={(event) => handleChange(event, enumValue)}
            defaultValue={
              mappedProperties[property].parameters[
                idx === 0 ? "firstIncludePattern" : "secondIncludePattern"
              ]
            }
          />
        </div>
      ))}
      <RadioGroup
        onChange={handleDefaultChange}
        value={mappedProperties[property].parameters.defaultBehavior}
      >
        <RadioGroup.Label>If neither pattern is found</RadioGroup.Label>
        <div className="mt-2 flex gap-2">
          {map(DefaultBehavior, (behavior) => (
            <RadioGroup.Option
              key={behavior}
              value={behavior}
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
                    {behavior === DefaultBehavior.ignore && "Ignore Entry"}
                    {behavior === DefaultBehavior.useFirst &&
                      propertyEnum[0].enumValue}
                    {behavior === DefaultBehavior.useSecond &&
                      propertyEnum[1].enumValue}
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
    </>
  );
};

function isPatternInInput(pattern: string, input: string | null) {
  if (pattern.length === 0 || !input) {
    return false;
  }
  for (const subPattern of pattern.split(",")) {
    if (input?.toLowerCase().includes(subPattern.trim().toLowerCase())) {
      return true;
    }
  }
  return false;
}

type Props = {
  property: Property;
  mappedProperties: MappedProperties;
  setMappedProperties: React.Dispatch<React.SetStateAction<MappedProperties>>;
};
