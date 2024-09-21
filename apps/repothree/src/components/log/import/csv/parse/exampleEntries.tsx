import React, { useMemo, Fragment } from "react";

const ExampleEntries: React.FC<Props> = ({ csvArray, csvColName }) => {
  const exampleCsvEntries = useMemo(() => {
    if (!csvColName) {
      return [];
    }
    const examples = csvArray.reduce(
      (acc: { wordCounts: number[]; examples: string[] }, row) => {
        const csvEntry = row[csvColName];

        if (!csvEntry) {
          return acc;
        }
        const propertyWordsCount = csvEntry.split(" ")?.length;
        if (acc.wordCounts.includes(propertyWordsCount)) {
          return acc;
        }

        return {
          wordCounts: [...acc.wordCounts, propertyWordsCount],
          examples: [...acc.examples, csvEntry],
        };
      },
      { wordCounts: [], examples: [] }
    );

    return examples.examples;
  }, [csvArray, csvColName]);

  return (
    <>
      {exampleCsvEntries.map((csvEntry: string) => (
        <Fragment key={csvEntry}>
          <span>{csvEntry}</span>
          <br />
        </Fragment>
      ))}
    </>
  );
};

type Props = {
  csvArray: { [key: string]: string | null }[];
  csvColName: string | null;
};

export default ExampleEntries;
