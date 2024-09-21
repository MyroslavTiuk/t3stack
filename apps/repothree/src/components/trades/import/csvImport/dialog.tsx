import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import DropFileInput from "./dropFileInput";
import ParseCsv from "./parse/parseCsv";
import PreviewCsv from "./previewCsv";
import {
  Steps,
  type MappedProperties,
  DEFAULT_MAPPED_PROPERTIES,
} from "./data";

const CsvDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<keyof typeof Steps>(Steps.selectCsv);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvArray, setCsvArray] = useState<
    { [colName: string]: string | null }[]
  >([]);
  const [mappedProperties, setMappedProperties] = useState<MappedProperties>(
    DEFAULT_MAPPED_PROPERTIES
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-4/5 max-h-[90%] w-full overflow-auto rounded-lg  bg-gradient-to-b from-neutral-50 to-neutral-200 p-4 drop-shadow">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold text-neutral-700">
              CSV Import
            </Dialog.Title>
            <button className="text-neutral-400 drop-shadow" onClick={onClose}>
              <XMarkIcon className="h-8 w-8" />
            </button>
          </div>
          <hr className="mb-4 h-0.5 bg-neutral-400" />
          {step === Steps.selectCsv && (
            <DropFileInput
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              setStep={setStep}
              setMappedProperties={setMappedProperties}
              setCsvArray={setCsvArray}
            />
          )}
          {step === Steps.parse && (
            <ParseCsv
              setStep={setStep}
              mappedProperties={mappedProperties}
              setMappedProperties={setMappedProperties}
              csvArray={csvArray}
            />
          )}
          {step === Steps.previewCsv && (
            <PreviewCsv
              setStep={setStep}
              mappedProperties={mappedProperties}
              csvArray={csvArray}
              setCsvArray={setCsvArray}
              file={selectedFile as File}
            />
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default CsvDialog;
