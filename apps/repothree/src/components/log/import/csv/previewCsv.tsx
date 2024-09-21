import React from "react";
import Button from "~/components/atoms/button";
import {
  type MappedProperties,
  Steps,
  PROPERTIES,
  PROPERTIES_DISPLAY_NAME,
  propertyValues,
  parseCsvValue,
} from "./data";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";
import axios from "axios";
import Papa from "papaparse";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";
import { mapValues } from "lodash";
import { produce } from "immer";
import Card from "~/components/atoms/card";
import type { CsvTransactionInput } from "~/server/strategies/transaction";
import { format } from "date-fns";
import { captureException } from "@sentry/nextjs";
import { OptionAction, Position } from "trackgreeks-database";

// TODO: maybe display option and equity transactions in separate tables, maybe even split the mapping and let users import them separately

const PreviewCsv: React.FC<Props> = ({
  setStep,
  mappedProperties,
  csvArray,
  setCsvArray,
  file,
}) => {
  const parsedRows = csvArray.reduce(
    (acc: ParsedRows, csvRow, idx) => {
      const parsedRow = mapValues(PROPERTIES, (property) => {
        const csvColName = mappedProperties[property].csvColName;
        if (!csvColName) {
          return null;
        }
        const transformedCsvEntry = mappedProperties[property].action(
          csvRow[csvColName],
          csvRow
        );
        return parseCsvValue(property, transformedCsvEntry);
      });

      return produce(acc, (draft) => {
        if (isValidOptionTransaction(parsedRow)) {
          draft.optionTransactions.push({
            ...(parsedRow as unknown as CsvTransactionInput["optionTransactions"][number]),
            underlyingSymbol: parsedRow.symbol as string,

            action: getOptionAction(parsedRow.position, parsedRow.expiry),
            fees: (parsedRow.fees as number) ?? 0,
          });
          draft.mapped.push(parsedRow);
          draft.mappedCsvRowIndexes.push(idx);
        } else if (isValidEquityTransaction(parsedRow)) {
          draft.equityTransactions.push({
            ...(parsedRow as unknown as CsvTransactionInput["equityTransactions"][number]),
            fees: (parsedRow.fees as number) ?? 0,
          });
          draft.mapped.push(parsedRow);
          draft.mappedCsvRowIndexes.push(idx);
        } else {
          draft.unmapped.push(csvRow);
        }
      });
    },
    {
      optionTransactions: [],
      equityTransactions: [],
      mapped: [],
      unmapped: [],
      mappedCsvRowIndexes: [],
    }
  );

  const handleDownloadUnparsedClick = () => {
    const csv = Papa.unparse(parsedRows.unmapped, {
      header: true,
      skipEmptyLines: true,
    });

    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const csvURL = window.URL.createObjectURL(csvData);

    const tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", `${file.name}-to-fix.csv`);
    tempLink.click();
  };

  const uploadCsv = api.csv.uploadCsv.useMutation();
  const saveUploadedCsvName = api.csv.saveUploadedCsvName.useMutation();
  const saveTransactions = api.transactions.saveCsvTransactions.useMutation();

  const handleImportClick = () => {
    const fileName = encodeURIComponent(file.name);
    const fileType = encodeURIComponent(file.type);

    uploadCsv.mutate(
      { fileName, fileType },
      {
        onSuccess: async (data) => {
          const { url, fields } = data;

          const formData = new FormData();

          Object.entries({ ...fields, file }).forEach(([key, value]) => {
            formData.append(key, value);
          });
          try {
            await axios.post(url, formData);
            await saveUploadedCsvName.mutate({ fileName });
          } catch (err) {
            captureException(err);
          }
        },
      }
    );

    saveTransactions.mutate(parsedRows, {
      onSuccess: () => {
        toast.success(
          `Imported ${parsedRows.mapped.length} transactions`,
          toastProps
        );
        setCsvArray((prev) =>
          prev.filter((_, idx) => !parsedRows.mappedCsvRowIndexes.includes(idx))
        );
      },
      onError: () => toast.error("Import failed, please try again", toastProps),
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-black">Transformed Rows</h2>
      <p className="text-sm">
        ({parsedRows.mapped.length} / {csvArray.length}) rows were successfully
        transformed and you can import them into your Track Greeks account.
      </p>
      <Card>
        <table className="w-full table-fixed overflow-x-scroll text-sm">
          <thead>
            <tr className="max-w-8">
              {propertyValues.map((prop) => (
                <th key={prop}>{PROPERTIES_DISPLAY_NAME[prop]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parsedRows.mapped.slice(0, 10).map((row, idx) => {
              return (
                <tr key={idx} className="h-10">
                  {propertyValues.map((prop) => {
                    return (
                      <td key={prop} className="w-8 border">
                        {(() => {
                          const entry = row?.[prop];
                          if (!entry) {
                            return null;
                          }
                          if (entry instanceof Date) {
                            return format(entry, "yyyy-MM-dd");
                          }
                          return entry;
                        })()}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {parsedRows.mapped.length > 10 && (
          <p>+ {parsedRows.mapped.length - 10} more rows</p>
        )}
      </Card>
      <div className="mt-4 flex justify-around">
        <Button
          className="mx-auto flex items-center"
          onClick={handleImportClick}
          icon={
            uploadCsv.isLoading ||
            saveTransactions.isLoading ||
            saveUploadedCsvName.isLoading ? (
              <div
                className="aspect-square h-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              />
            ) : (
              <ArrowDownOnSquareIcon className="h-5 w-5" />
            )
          }
          disabled={
            uploadCsv.isLoading ||
            saveTransactions.isLoading ||
            saveUploadedCsvName.isLoading ||
            parsedRows.mapped.length === 0
          }
        >
          Import
        </Button>
      </div>
      {parsedRows.unmapped.length > 0 && (
        <>
          <h2 className="text-xl font-black">Untransformed Rows</h2>
          <p className="text-sm">
            {parsedRows.unmapped.length} rows will be ignored because they miss
            mandatory information. You can download them as a new CSV file and
            fix them manually or go back and change the import settings for
            these rows.
          </p>
          <Card>
            <table className="w-full table-fixed overflow-x-scroll text-sm">
              <thead>
                <tr className="max-w-8">
                  {Object.keys(parsedRows.unmapped[0]).map((colName) => (
                    <th key={colName}>{colName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedRows.unmapped.slice(0, 10).map((row, idx) => {
                  return (
                    <tr key={idx} className="h-10">
                      {Object.keys(parsedRows.unmapped[0]).map((colName) => {
                        return (
                          <td key={colName} className="w-8 border">
                            {row?.[colName] ?? ""}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {parsedRows.unmapped.length > 10 && (
              <p>+ {parsedRows.unmapped.length - 10} more rows</p>
            )}
          </Card>
        </>
      )}
      <div className="mt-4 flex justify-around">
        <Button
          variant="outlined"
          className="mx-auto"
          onClick={() => setStep(Steps.parse)}
        >
          Back
        </Button>
        <Button
          className="mx-auto flex items-center"
          onClick={handleDownloadUnparsedClick}
          icon={<ArrowDownOnSquareIcon className="h-5 w-5" />}
        >
          Download missing rows
        </Button>
      </div>
    </div>
  );
};

function isValidOptionTransaction(row: {
  [key: string]: string | number | Date | null;
}) {
  return (
    !!row[PROPERTIES.symbol] &&
    !!row[PROPERTIES.transactionDate] &&
    !!row[PROPERTIES.quantity] &&
    !!row[PROPERTIES.netPrice] &&
    !!row[PROPERTIES.position] &&
    !!row[PROPERTIES.optionType] &&
    !!row[PROPERTIES.expirationDate] &&
    !!row[PROPERTIES.strikePrice]
  );
}

function isValidEquityTransaction(row: {
  [key: string]: string | number | Date | null;
}) {
  return (
    !!row[PROPERTIES.symbol] &&
    !!row[PROPERTIES.transactionDate] &&
    !!row[PROPERTIES.quantity] &&
    !!row[PROPERTIES.netPrice] &&
    !!row[PROPERTIES.position]
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOptionAction(position: any, expiry: any) {
  if (expiry === OptionAction.Expire) {
    return OptionAction.Expire;
  }
  if (expiry === OptionAction.Assign) {
    return OptionAction.Assign;
  }
  if (position === Position.Short) {
    return OptionAction.Sell;
  }
  return OptionAction.Buy;
}

type Props = {
  setStep: React.Dispatch<React.SetStateAction<keyof typeof Steps>>;
  csvArray: { [key: string]: string | null }[];
  setCsvArray: React.Dispatch<
    React.SetStateAction<
      {
        [colName: string]: string | null;
      }[]
    >
  >;
  mappedProperties: MappedProperties;
  file: File;
};

type ParsedRows = {
  optionTransactions: CsvTransactionInput["optionTransactions"];
  equityTransactions: CsvTransactionInput["equityTransactions"];
  mapped: { [key: string]: string | number | Date | null }[];
  unmapped: { [key: string]: string | null }[];
  mappedCsvRowIndexes: number[];
};

export default PreviewCsv;
