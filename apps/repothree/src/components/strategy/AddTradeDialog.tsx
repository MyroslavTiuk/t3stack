import React from "react";
// @ts-ignore
import { type Trade } from "trackgreeks-database";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import AddTrade from "./AddTrade";

const AddTradeDialog: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-h-[80%] w-full max-w-2xl overflow-auto rounded-lg  bg-gradient-to-b from-neutral-50 to-neutral-200 p-4 drop-shadow">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold text-neutral-700">
              Add Trade
            </Dialog.Title>
            <button className="text-neutral-400 drop-shadow" onClick={onClose}>
              <XMarkIcon className="h-8 w-8" />
            </button>
          </div>
          <hr className="mb-4 h-0.5 bg-neutral-400" />
          <AddTrade onSelect={onSelect} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (trade: Trade) => void;
};

export default AddTradeDialog;
