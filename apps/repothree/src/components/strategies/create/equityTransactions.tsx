import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Dialog } from "@headlessui/react";
import { sub } from "date-fns";
import TimeRangeSelector from "~/components/atoms/TimeRangeSelector";
// @ts-ignore
import StockTransactionList from "~/components/log/StockTransactionList";

const EquityTransactions: React.FC<Props> = ({
  transactionIds,
  addTransactionId,
  removeTransactionId,
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date>(
    sub(new Date(), { days: 7 })
  );
  const [endDate, setEndDate] = React.useState<Date>(new Date());

  return (
    <>
      <div className="my-2 flex flex-col gap-2">
        {transactionIds.map((transactionId) => (
          // @ts-ignore
          // eslint-disable-next-line react/jsx-no-undef
          <EquityTransaction
            key={transactionId}
            transactionId={transactionId}
            removeTransactionId={removeTransactionId}
          />
        ))}
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-h-[80%] w-full max-w-2xl overflow-auto rounded-lg  bg-gradient-to-b from-neutral-50 to-neutral-200 p-4 drop-shadow">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-xl font-semibold text-neutral-700">
                Add Stock Transaction
              </Dialog.Title>
              <button
                className="text-neutral-400 drop-shadow"
                onClick={() => setIsDialogOpen(false)}
                type="button"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
            </div>
            <hr className="mb-4 h-0.5 bg-neutral-400" />
            <TimeRangeSelector
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              setToCustom={false}
            />
            {/*@ts-ignore*/}
            <StockTransactionList
              startDate={startDate}
              endDate={endDate}
              onClick={(id) => {
                transactionIds.includes(id)
                  ? removeTransactionId(id)
                  : addTransactionId(id);
              }}
              selectedIds={transactionIds}
              showDelete={false}
            />
            <div className="mt-6 flex w-full justify-end">
              <button
                className="flex w-40 items-center justify-center gap-2 rounded-lg bg-blue  py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-blue/70 "
                onClick={() => setIsDialogOpen(false)}
                type="button"
              >
                <PlusIcon className="h-6 w-6" />
                <span>Add</span>
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <button
        className=" rounded-lg bg-orange px-3 py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-orange/70 "
        onClick={() => setIsDialogOpen(true)}
        type="button"
      >
        <PlusIcon className="h-5 w-5" />
      </button>
    </>
  );
};

type Props = {
  transactionIds: string[];
  addTransactionId: (id: string) => void;
  removeTransactionId: (id: string) => void;
};

export default EquityTransactions;
