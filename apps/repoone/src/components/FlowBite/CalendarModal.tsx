import Button from "~/components/log/button";
import React from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import OpenPosition from "~/components/FlowBite/OpenPosition";
import { Status } from "~/components/strategies/filters";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
};

export default function CalendarModal({ isOpen, onClose, date }: Props) {
  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-sm rounded-lg  bg-white px-4 pt-4">
            <div className="flex items-center justify-between border-b px-4 py-2 pb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                {date && date.toDateString()}
              </Dialog.Title>
              <button
                className="text-neutral-400 drop-shadow"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <OpenPosition
              filters={{
                startDate: date ?? new Date(),
                endDate: (() => {
                  const endDate = new Date(date ?? new Date());
                  // endDate?.setHours(23);
                  // endDate?.setMinutes(59);
                  endDate?.setDate(endDate.getDate() + 1);
                  return endDate;
                })(),
                tradingStrategies: [
                  "BuyAndHold",
                  "ShortAndHold",
                  "BuyAndSell",
                  "ShortAndBuy",
                  "CoveredCall",
                  "LongCallSpread",
                  "LongPutSpread",
                  "ShortCallSpread",
                  "ShortPutSpread",
                  "Custom",
                ],
                status: [Status.Open],
              }}
            />
            <div className="self-end p-6">
              <Button onClick={onClose}>Close</Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
