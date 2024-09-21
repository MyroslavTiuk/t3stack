import React from "react";
import { api } from "~/utils/api";
import ErrorMessage from "./ErrorMessage";
import { formatDate } from "~/utils/format";
import { XMarkIcon } from "@heroicons/react/24/outline";

const OptionTransaction: React.FC<Props> = ({
  transactionId,
  removeTransactionId,
}) => {
  const { data, isLoading } = api.transactions.getOptionTransaction.useQuery({
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
        {data.action} {data.quantity}x {data.underlyingSymbol}{" "}
        {formatDate(data.expirationDate)} {data.strikePrice} {data.optionType}
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

export default OptionTransaction;
