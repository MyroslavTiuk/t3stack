import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  buildDefaultMappedProperty,
  type MappedProperties,
  type Property,
} from "../data";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import produce from "immer";

const DEFAULT_VALUE = "default";

export const PropertySelect: React.FC<Props> = ({
  mappedProperties,
  setMappedProperties,
  property,
  originalColumnNames,
  setActiveProperty,
}) => {
  const [value, setValue] = useState(
    () => mappedProperties[property].csvColName ?? DEFAULT_VALUE
  );

  return (
    <div className="flex items-center">
      <select
        className="m-2 w-4/5 rounded-md"
        value={value}
        onChange={(event) => {
          setMappedProperties((prev) =>
            produce(prev, (draft) => {
              draft[property] = buildDefaultMappedProperty();
              draft[property].csvColName = event.target.value;
            })
          );
          setValue(event.target.value);
        }}
      >
        <option value={DEFAULT_VALUE} disabled hidden>
          Select column in CSV
        </option>
        {originalColumnNames.map((originalColName: string) => {
          return (
            <option key={originalColName} value={originalColName}>
              {originalColName}
            </option>
          );
        })}
      </select>
      {value !== DEFAULT_VALUE && (
        <div className="flex gap-2 px-2">
          <button
            onClick={() => {
              setActiveProperty((prev) =>
                prev === property ? null : property
              );
            }}
          >
            <WrenchScrewdriverIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setMappedProperties((prev) =>
                produce(prev, (draft) => {
                  draft[property] = buildDefaultMappedProperty();
                })
              );
              setValue("default");
              setActiveProperty((prev) => (prev === property ? null : prev));
            }}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

type Props = {
  mappedProperties: MappedProperties;
  setMappedProperties: React.Dispatch<React.SetStateAction<MappedProperties>>;
  property: Property;
  originalColumnNames: string[];
  setActiveProperty: React.Dispatch<React.SetStateAction<string | null>>;
};
