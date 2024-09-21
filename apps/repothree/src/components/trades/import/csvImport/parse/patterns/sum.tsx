import React from "react";
import { type Property, type MappedProperties } from "../../data";
import { filter, uniq } from "lodash";
import produce from "immer";

export const Sum: React.FC<Props> = ({
  property,
  originalColumnNames,
  mappedProperties,
  setMappedProperties,
}) => {
  const checkboxColNames = originalColumnNames.filter(
    (colName) => colName !== mappedProperties[property].csvColName
  );

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
    columnName: string
  ) {
    setMappedProperties((prev) => {
      const sumColNames = event.target.checked
        ? uniq([
            ...mappedProperties[property].parameters.sumColNames,
            columnName,
          ])
        : filter(
            mappedProperties[property].parameters.sumColNames,
            (colName) => colName !== columnName
          );

      return produce(prev, (draft) => {
        draft[property].parameters.sumColNames = sumColNames;
        draft[property].action = (_input, row) => {
          const sum = sumColNames.reduce((acc, colName) => {
            const value = Number(row[colName]);
            if (!isNaN(Number(value))) {
              return acc + value;
            }
            return acc;
          }, 0);
          return String(sum);
        };
      });
    });
  }

  return (
    <div>
      <div>
        Select all extra columns to be added to the value in the selected column
      </div>
      {checkboxColNames.map((columnName) => (
        <div key={columnName} className="mb-1 flex items-center">
          <input
            id={`${columnName}${property}`}
            onChange={(event) => handleInputChange(event, columnName)}
            type="checkbox"
            value=""
            className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-teal-600 focus:ring-2 focus:ring-teal-600 "
          />
          <label
            htmlFor={`${columnName}${property}`}
            className="ml-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {columnName}
          </label>
        </div>
      ))}
    </div>
  );
};

type Props = {
  property: Property;
  originalColumnNames: string[];
  mappedProperties: MappedProperties;
  setMappedProperties: React.Dispatch<React.SetStateAction<MappedProperties>>;
};
