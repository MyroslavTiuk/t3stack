import { Dialog, RadioGroup } from "@headlessui/react";
import {
  CheckCircleIcon,
  CircleStackIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import ErrorMessage from "~/components/atoms/ErrorMessage";
import { toastProps } from "~/styles/toast";
import { api } from "~/utils/api";

const deleteInputSchema = z.object({
  keepTransactions: z.boolean(),
});
type DeleteInput = z.infer<typeof deleteInputSchema>;

const DeleteTdIntegrationDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  const { handleSubmit, control } = useForm<DeleteInput>({
    resolver: zodResolver(deleteInputSchema),
    defaultValues: {
      keepTransactions: false,
    },
  });

  const { mutate, isLoading, isError } =
    api.tdAmeritrade.deleteIntegration.useMutation();

  const onSubmit: SubmitHandler<DeleteInput> = (data) => {
    mutate(data, {
      onSuccess: () => {
        void utils.transactions.invalidate();
        // @ts-ignore
        void utils.trades.invalidate();
        void utils.tdAmeritrade.invalidate();
        toast.success("Deleted TD Ameritrade integration", toastProps);
        onClose();
      },
    });
  };
  const utils = api.useContext();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-lg  bg-gradient-to-b from-neutral-50 to-neutral-200 p-4 drop-shadow">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold text-neutral-700">
              Delete TD Ameritrade Integration
            </Dialog.Title>
            <button className="text-neutral-400 drop-shadow" onClick={onClose}>
              <XMarkIcon className="h-8 w-8" />
            </button>
          </div>
          <hr className="mb-4 h-0.5 bg-neutral-400" />
          <p>
            Once you delete your integration with TD Ameritrade, you can no
            longer automatically pull in transaction data from your TD
            Ameritrade account.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="keepTransactions"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <RadioGroup {...field} value={field.value}>
                  <div className="mt-4 flex gap-2">
                    {[
                      {
                        value: true,
                        label: "Keep trades",
                        icon: <CircleStackIcon className="mr-1 h-5 w-5" />,
                      },
                      {
                        value: false,
                        label: "Delete trades",
                        icon: <TrashIcon className="mr-1 h-5 w-5" />,
                      },
                    ].map(({ value, label, icon }) => (
                      <RadioGroup.Option
                        key={label}
                        value={value}
                        className={({ active }) =>
                          `${
                            active
                              ? "border-teal-600 ring-2 ring-teal-600"
                              : "border-gray-300"
                          } relative flex w-1/2 cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none`
                        }
                      >
                        {({ checked, active }) => (
                          <div className="flex items-center gap-1">
                            {icon}
                            <RadioGroup.Label className="font-bold">
                              {label}
                            </RadioGroup.Label>
                            <CheckCircleIcon
                              className={`${
                                !checked ? "invisible" : ""
                              } h-5 w-5 text-teal-600`}
                              aria-hidden="true"
                            />
                            <span
                              className={`${active ? "border" : "border-2"}
                  ${checked ? "border-teal-600" : "border-transparent"} 
                  pointer-events-none absolute -inset-px rounded-lg`}
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              )}
            />

            <button
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-400 px-3 py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-red-400/70 disabled:cursor-not-allowed disabled:bg-red-400/50 md:px-2"
              type="submit"
            >
              <TrashIcon className="h-5 w-5" />
              {isLoading ? "Deleting..." : "Delete"}
            </button>
            {isError && (
              <ErrorMessage>
                Failed to delete integration, try again!
              </ErrorMessage>
            )}
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default DeleteTdIntegrationDialog;
