import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import TdAmeritradeIntegration from "./tdIntegration";

const TdIntegrationDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center py-4">
        <Dialog.Panel className="w-full max-w-sm rounded-lg  bg-gradient-to-b from-neutral-50 to-neutral-200 py-4">
          <div className="flex items-center justify-between border-b px-4 py-2 pb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Import Broker
            </Dialog.Title>
            <button className="text-neutral-400 drop-shadow" onClick={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <TdAmeritradeIntegration />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default TdIntegrationDialog;
