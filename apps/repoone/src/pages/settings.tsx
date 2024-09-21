import React, { Fragment, useEffect, useState, useRef } from "react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Card from "~/components/atoms/card";
import { api } from "~/utils/api";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteTdIntegrationDialog from "~/components/log/import/tdAmeritrade/deleteDialog";
import ErrorMessage from "~/components/atoms/ErrorMessage";
import { Switch } from "@headlessui/react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { Popover } from "@headlessui/react";
import ApiKeyForm from "~/components/settings/apiKeyForm/ApiKeyForm";

interface LevelsBase {
  level1: string;
  level2: string;
  level3: string;
  level4: string;
}

const Settings: NextPage = () => {
  const { data } = useSession();
  const name = data?.user.name;
  const [isEnabled, setEnabled] = useState(true);
  const levelsBase: LevelsBase = {
    level1: "Level1",
    level2: "Level2",
    level3: "Level3",
    level4: "Level4",
  };

  const levelDisplay = {
    Level1: "Level 1 (Covered Calls & Cash Secured Puts)",
    Level2: "Level 2 (Long calls & puts)",
    Level3: "Level 3 (Debit & Credit Spreads)",
    Level4: "Level 4 (Naked Options)",
  };

  const [selectedLevel, setSelectedLevel] = useState(levelsBase.level4);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: tdAmeritrade, isLoading } =
    api.tdAmeritrade.getIntegration.useQuery();

  const {
    data: portalUrl,
    isLoading: isPortalLoading,
    mutate: createPortalSession,
    isError: isPortalError,
  } = api.stripe.createPortalSession.useMutation();

  const { data: user } = api.calculations.getCurrentUserSettings.useQuery();
  const { mutate } = api.calculations.updateCurrentUserSettings.useMutation();

  useEffect(() => {
    setSelectedLevel(user?.optionTradingLevel ?? levelsBase.level4);
    setEnabled(user?.marginTrading ?? true);
  }, [user]);

  const setEnabledToSwitch = (): void => {
    mutate({ marginTrading: !user.marginTrading });
    setEnabled(!isEnabled);
  };

  const setSelectedLevelHandler = (level: string): void => {
    setSelectedLevel(level);
    mutate({ optionTradingLevel: level });
  };

  if (portalUrl) {
    window.location.assign(portalUrl);
  }

  const timeoutDuration = 120;

  const triggerRef = useRef();
  const timeOutRef = useRef();

  const handleEnter = (isOpen) => {
    clearTimeout(timeOutRef.current);
    // @ts-ignore
    !isOpen && triggerRef?.current?.click();
  };

  const handleLeave = (isOpen) => {
    // @ts-ignore
    timeOutRef.current = setTimeout(() => {
      // @ts-ignore
      isOpen && triggerRef?.current?.click();
    }, timeoutDuration);
  };

  return (
    <>
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
                className="mt-3 flex items-center gap-2 rounded-lg bg-blue px-1 py-1 text-sm font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-blue/70 hover:bg-opacity-10 md:px-2 lg:text-base"
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
              <Link href="/" className="text-orange underline">
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
                  className="flex items-center gap-2 rounded-lg bg-blue px-1 py-2 text-sm font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-blue/70 md:px-2 lg:text-base"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <TrashIcon className="h-6 w-6" />
                  Delete Integration
                </button>
              </div>
            </div>
          )}
        </Card>
        <div className="flex max-w-[650px] flex-col gap-y-4 pb-32">
          <h2 className="text-xl font-semibold text-neutral-700">
            Trading settings
          </h2>
          <div className="flex flex-row justify-between">
            <span>Margin trading</span>
            <span>{isEnabled ? "Enabled" : "Disabled"}</span>
            <Switch
              checked={user?.marginTrading ?? true}
              onClick={() => setEnabledToSwitch()}
              className={`${
                isEnabled ? "bg-green-500" : "bg-gray-600"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Use setting</span>
              <span
                className={`${
                  isEnabled ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          <div className="flex flex-row items-center justify-between">
            <span>Option trading</span>
            <div className="ml-8 w-28">
              <Listbox
                value={selectedLevel}
                onChange={(level) => setSelectedLevelHandler(level)}
              >
                {({ open }) => (
                  <div className="relative mt-1">
                    <Listbox.Button className="hover:none focus:none focus-visible:none relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-gray-900 focus-visible:ring-offset-gray-900 sm:text-sm">
                      <span className="block w-16 text-lg">
                        {levelDisplay[selectedLevel].slice(0, 8)}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        {open ? (
                          <ChevronUpIcon
                            className="h-5 w-5 text-gray-900"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDownIcon
                            className="h-5 w-5 text-gray-900"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute left-[-120%] z-50 mt-1 max-h-80 w-80 transform overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:left-0 sm:text-sm">
                        {Object.values(levelsBase).map((level: string) => (
                          <Listbox.Option
                            key={level}
                            value={level}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {levelDisplay[level]}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900">
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                )}
              </Listbox>
            </div>
            <Popover>
              {({ open }) => (
                <div
                  onMouseEnter={() => handleEnter(open)}
                  onMouseLeave={() => handleLeave(open)}
                >
                  <Popover.Button
                    ref={triggerRef}
                    className="text-blue underline"
                  >
                    About
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute right-2 z-50 mt-3 w-64 transform rounded-lg bg-white px-4 py-2 text-xs shadow-md sm:w-96 sm:-translate-x-1/2 sm:text-sm">
                      Option levels dictates what option strategies you can
                      trade in your brokerage account. Generally speaking the
                      higher the level, the more risk you could be taking on.
                      <br /> <br />
                      It is well advised to know all the risks with all
                      strategies before trading
                    </Popover.Panel>
                  </Transition>
                </div>
              )}
            </Popover>
          </div>
          <div className="my-3 h-0.5 w-full bg-gray-200"></div>
          <ApiKeyForm />
        </div>
      </div>
    </>
  );
};

export default Settings;
