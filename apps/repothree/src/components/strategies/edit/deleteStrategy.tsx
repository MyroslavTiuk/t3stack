import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import router from "next/router";
import React from "react";
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";
import { api } from "~/utils/api";
import ErrorMessage from "../../atoms/ErrorMessage";

const DeleteStrategy: React.FC<Props> = ({ id, onCancel }) => {
  const { mutate, isLoading, isError } =
    api.strategies.deleteStrategy.useMutation();
  function onClickDelete() {
    mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Successfully deleted strategy", toastProps);
          router.push("/strategy");
        },
      }
    );
  }

  return (
    <>
      <p>Are you sure you want to delete this strategy?</p>
      <div className="flex w-full justify-end gap-4 pt-4">
        <button
          className="flex  items-center justify-center gap-2 rounded-lg border-2 border-orange px-2 py-1 font-semibold text-orange no-underline drop-shadow transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10"
          onClick={onCancel}
        >
          <XMarkIcon className="h-6 w-6" />
          <span>Cancel</span>
        </button>
        <button
          className="flex items-center gap-2 rounded-lg bg-orange px-3 py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-orange/70 "
          onClick={onClickDelete}
        >
          <TrashIcon className="h-6 w-6" />
          <span>{isLoading ? "Deleting..." : "Delete"}</span>
        </button>
      </div>
      {isError && <ErrorMessage>Something went wrong</ErrorMessage>}
    </>
  );
};

type Props = {
  id: string;
  onCancel: () => void;
};

export default DeleteStrategy;
