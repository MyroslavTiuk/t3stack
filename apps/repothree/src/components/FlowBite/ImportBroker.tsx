import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import TdIntegrationDialog from "~/components/trades/import/tdAmeritradeIntegration/dialog";
import Image from "next/image";
import tdAmeritradeLogo from "~/images/td-logo.png";

const ImportBroker: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isTdDialogOpen, setIsTdDialogOpen] = useState(false);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="w-full max-w-sm rounded-lg  bg-white pt-4">
          <div className="flex items-center justify-between border-b px-4 py-2 pb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Import Broker
            </Dialog.Title>
            <button className="text-neutral-400 drop-shadow" onClick={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex w-full flex-col gap-4 border-b p-4">
            <p className="text-gray-500">
              Connect with your broker and import all of your trades.
            </p>
            <div className="flex flex-col gap-3">
              <div className="  rounded-lg bg-gray-50 p-3">
                <button
                  className="flex items-center gap-2 rounded-lg bg-[#40a829] px-1 py-2 text-sm font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-[#40a829]/70 md:px-2 lg:text-base"
                  onClick={() => setIsTdDialogOpen(true)}
                >
                  <Image
                    src={tdAmeritradeLogo}
                    width={20}
                    height={20}
                    alt="TD Ameritrade Logo"
                  />
                  Ameritrade Import
                </button>
                <TdIntegrationDialog
                  isOpen={isTdDialogOpen}
                  onClose={() => setIsTdDialogOpen(false)}
                />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default ImportBroker;
