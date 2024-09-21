import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";
import { api } from "~/utils/api";

const SelectTdAccountId: React.FC = () => {
  const router = useRouter();
  const { isLoading, data } = api.tdAmeritrade.getIntegration.useQuery();
  const addMainAccountId = api.tdAmeritrade.addMainAccountId.useMutation();

  const handleAddMainIdClick = (accountId: string, tokenId: string) => {
    addMainAccountId.mutate(
      {
        tokenId: tokenId,
        accountId,
      },
      {
        onSuccess: () => {
          toast.success(
            "Successfully integrated with TD Ameritrade",
            toastProps
          );
          router.push("/");
        },
        onError: () => {
          toast.error("Something went wrong. Please try again", toastProps);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex w-full animate-pulse flex-col items-center"
      >
        <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  if (!data || !data.accountIds || !data.accountIds.length) {
    return (
      <p>
        No integration with TD Ameritrade found. Please set up the integration
        again.
      </p>
    );
  }

  if (addMainAccountId.isLoading) {
    return (
      <div className="mt-10 flex w-full flex-col items-center gap-4">
        <div
          className="aspect-square h-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        ></div>
        <p className="max-w-prose">
          Importing trades from TD Ameritrade. This may take up to a few minutes
          depending on how many trades you made since the last sync.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 py-10">
      <p className="max-w-prose">
        Your TD Ameritrade login contains multiple accounts. Please choose the
        one from which you would like to import trading data.
      </p>
      {data.accountIds.map((accountId) => (
        <div
          key={accountId}
          className="flex items-center justify-center gap-x-2"
        >
          <p>Account {accountId}</p>
          {!data?.mainAccountId && (
            <button
              onClick={() =>
                handleAddMainIdClick(accountId, data?.tokenId as string)
              }
              className="flex items-center gap-2 rounded-lg bg-teal-600 p-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-teal-600/70 md:px-2"
            >
              Import trades
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SelectTdAccountId;
