import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Position, TransactionSource } from "trackgreeks-database";
import React from "react";
import Card from "../atoms/card";
import { format } from "date-fns";
import { TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import tdAmeritradeLogo from "~/images/td-logo.png";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";

const EditTransactionsDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  trade,
}) => {
  // @ts-ignore
  const { mutate } = api.transactions.deleteTransaction.useMutation();
  const utils = api.useContext();

  function onClickDelete(transactionId: string) {
    mutate(
      { id: transactionId },
      {
        onSuccess: () => {
          void utils.transactions.invalidate();
          toast.success("Successfully deleted transaction", toastProps);
        },
      }
    );
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-lg  bg-gradient-to-b from-neutral-50 to-neutral-200 p-4 drop-shadow">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold text-neutral-700">
              {trade.name}
            </Dialog.Title>
            <button className="text-neutral-400 drop-shadow" onClick={onClose}>
              <XMarkIcon className="h-8 w-8" />
            </button>
          </div>
          <hr className="mb-4 h-0.5 bg-neutral-400" />
          <div className="flex flex-col gap-2">
            {trade.entries.map(
              (entry: {
                transactionId: React.Key | null | undefined;
                transaction: {
                  date: number | Date;
                  position: string;
                  quantity: any;
                  source: string;
                };
              }) => (
                <Card key={entry.transactionId}>
                  <div className="flex justify-between">
                    <span>{`${format(
                      entry.transaction.date,
                      "yyyy/MM/dd - kk:mm"
                    )} ${
                      entry.transaction.position === Position.Long
                        ? "buy"
                        : "sell"
                    } ${entry.transaction.quantity}`}</span>
                    {entry.transaction.source === TransactionSource.Manual ||
                      (entry.transaction.source === TransactionSource.Csv && (
                        <button
                          // @ts-ignore
                          onClick={() => onClickDelete(entry.transactionId)}
                        >
                          <TrashIcon className="h-8 w-8" />
                        </button>
                      ))}
                    {entry.transaction.source ===
                      TransactionSource.TdAmeritrade && (
                      <Image
                        src={tdAmeritradeLogo}
                        width={20}
                        height={20}
                        alt="TD Ameritrade Logo"
                      />
                    )}
                  </div>
                </Card>
              )
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  trade: any;
};

export default EditTransactionsDialog;
