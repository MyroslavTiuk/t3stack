import React from "react";
import { api } from "~/utils/api";
import ErrorMessage from "./ErrorMessage";
import { XMarkIcon } from "@heroicons/react/24/outline";

const EquityTransaction: React.FC<Props> = ({
  transactionId,
  removeTransactionId,
}) => {
  const { data, isLoading } = api.transactions.getEquityTransaction.useQuery({
    id: transactionId,
  });

  if (isLoading) {
    return (
      <div
        role="status"
        className=" h-6 w-full animate-pulse rounded-lg bg-gray-200"
      />
    );
  }
  if (!data) {
    return <ErrorMessage>Did not find transaction.</ErrorMessage>;
  }
  return (
    <div className="flex gap-5">
      <p>
        {data.position} {data.quantity}x {data.symbol}
      </p>
      <button
        className="text-neutral-400 drop-shadow"
        onClick={() => removeTransactionId(transactionId)}
        type="button"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

type Props = {
  transactionId: string;
  removeTransactionId: (id: string) => void;
};

export default EquityTransaction;
