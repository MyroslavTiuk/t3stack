import React, { useMemo } from "react";
import SelectTemplateValue from "./selectTemplate";
import { type MappedProperties, type Property } from "../../../data";
import produce from "immer";

export const ExtractFromString: React.FC<Props> = ({
  property,
  csvArray,
  setMappedProperties,
  mappedProperties,
}) => {
  const csvColName = mappedProperties[property].csvColName;

  const exampleCsvEntries = useMemo(() => {
    if (!csvColName) {
      return [];
    }
    const exampleEntries = csvArray.reduce(
      (acc: { wordCounts: number[]; exampleEntries: string[] }, row) => {
        const entry = row[csvColName];
        if (!entry) {
          return acc;
        }

        const wordCount = entry.split(" ")?.length;
        if (acc.wordCounts.includes(wordCount)) {
          return acc;
        }

        return {
          wordCounts: [...acc.wordCounts, wordCount],
          exampleEntries: [...acc.exampleEntries, entry],
        };
      },
      { wordCounts: [], exampleEntries: [] }
    );

    return exampleEntries.exampleEntries;
  }, [csvArray, csvColName]);

  const { stringTemplate, selectedWordIndexes } =
    mappedProperties[property].parameters;

  function handleTemplateChange(value: string) {
    setMappedProperties((prev) =>
      produce(prev, (draft) => {
        draft[property].parameters.stringTemplate = value;
        draft[property].parameters.selectedWordIndexes = [];
      })
    );
  }

  function handleSelectedWordsChange(selectedIdx: number) {
    setMappedProperties((prev) => {
      const updatedSelectedWordIndexes = selectedWordIndexes.includes(
        selectedIdx
      )
        ? selectedWordIndexes.filter((i) => i !== selectedIdx)
        : [...selectedWordIndexes, selectedIdx];
      updatedSelectedWordIndexes.sort((a, b) => a - b);

      return produce(prev, (draft) => {
        draft[property].parameters.selectedWordIndexes =
          updatedSelectedWordIndexes;
        draft[property].action = (input) => {
          const words = input ? input.split(" ") : [];
          const templateWordCount = stringTemplate.split(" ")?.length;
          if (templateWordCount !== words.length) {
            return null;
          }
          return updatedSelectedWordIndexes.map((i) => words[i]).join(" ");
        };
      });
    });
  }

  return (
    <div>
      <SelectTemplateValue
        onChange={handleTemplateChange}
        exampleCsvEntries={exampleCsvEntries}
        value={stringTemplate}
      />
      {stringTemplate && (
        <>
          <p className="mt-3 flex justify-center">Words to be extracted</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {stringTemplate.split(" ").map((substring, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectedWordsChange(idx)}
                className={`${
                  selectedWordIndexes.includes(idx)
                    ? "border-orange ring-1 ring-orange"
                    : "border-gray-300"
                } flex items-center gap-2 rounded-lg border bg-white p-4 shadow-sm focus:outline-none`}
              >
                <p className="font-bold">{substring}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

type Props = {
  csvArray: { [key: string]: string | null }[];
  property: Property;
  mappedProperties: MappedProperties;
  setMappedProperties: React.Dispatch<React.SetStateAction<MappedProperties>>;
};
