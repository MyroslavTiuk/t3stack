import React from "react";
import { api } from "~/utils/api";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

import { toast } from "react-toastify";
import { format } from "date-fns";
import { toastProps } from "~/styles/toast";
import SelectTdAccountId from "~/components/atoms/selectTdAccountId";
import { env } from "~/env.mjs";

const TDIntegration: React.FC = () => {
  const { isLoading, data, refetch } =
    api.tdAmeritrade.getIntegration.useQuery();

  const hasTdIntegration = data?.accountIds && data?.accountIds.length > 0;
  const hasMainAccount = data?.mainAccountId;

  const { mutate: mutateSync, isLoading: isSyncLoading } =
    api.tdAmeritrade.sync.useMutation();

  const handleSyncClick = () => {
    mutateSync(undefined, {
      onSuccess: () => {
        refetch();
        toast.success(
          "Successfully imported trades from TD Ameritrade",
          toastProps
        );
      },
      onError: () => {
        toast.error("Something went wrong. Please try again", toastProps);
      },
    });
  };

  const redirect_uri = encodeURIComponent(
    `${window.location.origin}/td-ameritrade-integration`
  );

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

  if (isSyncLoading) {
    return (
      <div className="flex w-full flex-col items-center gap-4">
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

  if (hasTdIntegration && !hasMainAccount) {
    return <SelectTdAccountId />;
  }

  if (hasTdIntegration) {
    return (
      <div className="flex flex-col gap-2">
        <>
          <p>Your TD Ameritrade account: {data.mainAccountId}</p>
          {data?.lastSync && (
            <p>Last import: {format(data.lastSync, "MM/dd/yyyy")}</p>
          )}
          <button
            onClick={handleSyncClick}
            className="flex items-center gap-2 rounded-lg bg-[#40a829] px-1 py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-[#40a829]/70 md:px-2"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Sync with TD Ameritrade
          </button>
        </>
      </div>
    );
  }

  return (
    <>
      <p>
        Import your trades directly from TD Ameritrade. The link below will take
        you to a login page of TD Ameritrade. After entering your credentials
        you will be redirected back here and we will fetch your trades
        automatically. You only need to set this integration up once, afterwards
        you can choose to import new trades at any time.
      </p>
      <a
        href={`https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=${redirect_uri}&client_id=${env.NEXT_PUBLIC_TD_AMERITRADE_API_KEY}%40AMER.OAUTHAP`}
        className="mt-4 flex items-center gap-2 rounded-lg bg-[#40a829] px-1 py-2 font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-[#40a829]/70 md:px-2"
      >
        <ArrowTopRightOnSquareIcon className="h-5 w-5" />
        Set up TD Ameritrade integration
      </a>
    </>
  );
};

export default TDIntegration;
