import { Dialog } from "@headlessui/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import DeleteStrategy from "./deleteStrategy";
import StrategyForm from "../create/strategyForm";
import { type StrategyInput } from "~/server/strategies/strategies";

const EditStrategy: React.FC<Props> = ({ id, strategyInput }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showStrategyForm, setShowStrategyForm] = useState(false);

  return (
    <>
      <Dialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="rounded-lg  bg-gradient-to-b from-neutral-50 to-neutral-200 p-4 drop-shadow">
            <Dialog.Title className="text-xl font-semibold text-neutral-700">
              Delete Strategy
            </Dialog.Title>
            <hr className="mb-4 h-0.5 bg-neutral-400" />
            <DeleteStrategy onCancel={() => setIsDeleteOpen(false)} id={id} />
          </Dialog.Panel>
        </div>
      </Dialog>
      {showStrategyForm ? (
        <StrategyForm
          onCancel={() => setShowStrategyForm((prev) => !prev)}
          initialState={strategyInput}
          id={id}
        />
      ) : (
        <div className="flex w-full justify-end gap-4 py-7">
          <button
            className="flex  items-center justify-center gap-2 rounded-lg border-2 border-orange px-2 py-1 font-semibold text-orange no-underline drop-shadow transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10"
            onClick={() => setShowStrategyForm(true)}
          >
            <PencilSquareIcon className="h-6 w-6" />
            <span>Edit</span>
          </button>
          <button
            className="flex  items-center justify-center gap-2 rounded-lg border-2 border-orange px-2 py-1 font-semibold text-orange no-underline drop-shadow transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10"
            onClick={() => setIsDeleteOpen(true)}
          >
            <TrashIcon className="h-6 w-6" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </>
  );
};

type Props = {
  id: string;
  strategyInput: StrategyInput;
};

export default EditStrategy;
