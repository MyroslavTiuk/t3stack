import React, { useState } from "react";
import { ChevronUpIcon, XMarkIcon } from "@heroicons/react/24/solid";

import Papa from "papaparse";

import ErrorMessage from "~/components/atoms/ErrorMessage";
import { DEFAULT_MAPPED_PROPERTIES, Steps } from "./data";
import Button from "~/components/atoms/button";
import { type MappedProperties } from "./data";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { Disclosure } from "@headlessui/react";

const DropFileInput: React.FC<Props> = ({
  selectedFile,
  setSelectedFile,
  setStep,
  setMappedProperties,
  setCsvArray,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSelectedFile(null);
    setMappedProperties(DEFAULT_MAPPED_PROPERTIES);
    const file = e.target.files?.[0];

    if (!file) {
      setErrorMessage("Please select a CSV file");
      return;
    }

    if (file.type !== "text/csv") {
      setErrorMessage(
        "Only CSV files are supported, make sure to upload a valid CSV file."
      );
      return;
    }

    setSelectedFile(file);
    Papa.parse<{ [columnName: string]: string | null }>(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        setCsvArray(data);
      },
    });
    setStep(Steps.parse);
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg border-2 border-solid border-orange px-4 py-2 text-sm focus:outline-none focus-visible:ring focus-visible:ring-orange focus-visible:ring-opacity-75">
              <span>
                Check out this video for a brief explanation on how to use our
                import tool
              </span>
              <ChevronUpIcon
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-orange`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="h-64">
              <iframe
                src="https://www.loom.com/embed/73cebf7ce148442692bedeb1702b4907?sid=817a744b-b49e-4eea-a1b9-613101b37a2e"
                allowFullScreen
                className="h-full w-full"
              ></iframe>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {!selectedFile && (
        <label
          htmlFor="dropzone-file"
          className="h-54 flex w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 pb-6 pt-5 hover:bg-gray-100"
        >
          <CloudArrowUpIcon className="mb-3 h-10 w-10" />
          <p className="mb-2 text-sm">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="max-w-prose text-sm">
            Upload a CSV file containing your option and equity trading
            transactions. You can export your transaction history from ANY
            trading platform as a CSV file and upload it here. In the next step,
            you will make sure that the data is imported correctly.
          </p>
          <input
            id="dropzone-file"
            type="file"
            className="absolute h-[30%] w-full cursor-pointer opacity-0"
            onChange={onFileChange}
            accept="text/csv"
          />
        </label>
      )}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {selectedFile && (
        <div className="flex items-center justify-center gap-4">
          <p>{selectedFile.name}</p>
          <button
            className="text-neutral-400 drop-shadow"
            onClick={() => {
              setSelectedFile(null);
              setMappedProperties(DEFAULT_MAPPED_PROPERTIES);
            }}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      )}
      <Button
        className="mx-auto"
        disabled={!selectedFile}
        onClick={() => setStep(Steps.parse)}
      >
        Next
      </Button>
    </div>
  );
};

type Props = {
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  setStep: React.Dispatch<React.SetStateAction<keyof typeof Steps>>;
  setMappedProperties: React.Dispatch<React.SetStateAction<MappedProperties>>;
  setCsvArray: React.Dispatch<
    React.SetStateAction<
      {
        [colName: string]: string | null;
      }[]
    >
  >;
};

export default DropFileInput;
