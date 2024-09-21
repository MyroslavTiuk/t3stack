import React, { useState } from "react";
import { type NextPage } from "next";
import Header from "~/components/layout/header/header";
import { useSession } from "next-auth/react";
import Card from "~/components/atoms/card";
import { api } from "~/utils/api";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteTdIntegrationDialog from "~/components/trades/import/tdAmeritradeIntegration/deleteDialog";
import ErrorMessage from "~/components/atoms/ErrorMessage";

const Settings: NextPage = () => {
  const { data } = useSession();
  const name = data?.user.name;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: tdAmeritrade, isLoading } =
    api.tdAmeritrade.getIntegration.useQuery();

  const {
    data: portalUrl,
    isLoading: isPortalLoading,
    mutate: createPortalSession,
    isError: isPortalError,
  } = api.stripe.createPortalSession.useMutation();

  if (portalUrl) {
    window.location.assign(portalUrl);
  }

  return (
    <>
      <Header />
      <div className="flex flex-col gap-y-4 p-3 md:p-8">
        <h1 className="text-3xl font-semibold text-neutral-700">
          Account Settings
        </h1>

        <p>You are logged in {name ? `as ${name}` : ""}</p>

        <h2 className="text-xl font-semibold text-neutral-700">Subscription</h2>

        <Card className="max-w-prose">
          {data?.user.subscriptionActive && (
            <>
              <p className="mt-3">Your monthly subscription is active.</p>
              <button
                disabled={isPortalLoading}
                onClick={() => {
                  createPortalSession();
                }}
                className="mt-3 flex items-center gap-2 rounded-lg bg-red-400 px-1 py-1 text-sm font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-red-400/70 hover:bg-opacity-10 md:px-2 lg:text-base"
              >
                {isPortalLoading && (
                  <div
                    className="aspect-square h-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  ></div>
                )}
                Manage Account
              </button>
              {isPortalError && (
                <ErrorMessage>
                  Failed to manage billing account. Try refreshing page, if that
                  does not work contact trackgreeks@gmail.com
                </ErrorMessage>
              )}
            </>
          )}
        </Card>

        <h2 className="text-xl font-semibold text-neutral-700">
          TD Ameritrade integration
        </h2>
        <Card className="max-w-prose">
          {isLoading && (
            <div
              role="status"
              className="flex w-full animate-pulse flex-col items-center gap-3"
            >
              <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            </div>
          )}
          {!isLoading && !tdAmeritrade && (
            <p>
              No TD Ameritrade integration found. Set up your integration on the{" "}
              <Link href="/" className="text-teal-600 underline">
                home page
              </Link>
              .
            </p>
          )}
          {tdAmeritrade && (
            <div className="flex flex-col gap-y-2">
              <DeleteTdIntegrationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
              />
              <p>
                You have a TD Ameritrade import set up for account{" "}
                {tdAmeritrade.mainAccountId}.
              </p>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 rounded-lg bg-red-400 px-1 py-2 text-sm font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-red-400/70 md:px-2 lg:text-base"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <TrashIcon className="h-6 w-6" />
                  Delete Integration
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default Settings;
