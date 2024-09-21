import { Dialog } from "@headlessui/react";
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import TransactionForm from "./form";

const SaveTransactionDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  const initialRef = React.useRef(null);
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      initialFocus={initialRef}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-h-[100%] w-full max-w-lg overflow-auto rounded-lg  bg-gradient-to-b from-neutral-50 to-neutral-200 p-4 drop-shadow">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold text-neutral-700">
              Add Trade
            </Dialog.Title>
            <button className="text-neutral-400 drop-shadow" onClick={onClose}>
              <XMarkIcon className="h-8 w-8" />
            </button>
          </div>
          <hr className="h-0.5 bg-neutral-400" />
          <TransactionForm onClose={onClose} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default SaveTransactionDialog;
