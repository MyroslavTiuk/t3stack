"use client";
import { Sidebar } from "flowbite-react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalculatorIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Avatar, Dropdown } from "flowbite-react";
import SignOutButton from "~/components/layout/header/signOutButton";
import { signOut } from "next-auth/react";
import { Transition } from "@headlessui/react";
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";

export type SidebarProps = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
};

function useClickOutside(ref, callback: (v: boolean) => void) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export function SidebarComponent({
  isCollapsed,
  setSidebarCollapsed,
}: SidebarProps) {
  const [showCalcItems, setShowCalcItems] = useState<boolean>(false);
  const [showJournalItems, setShowJournalItems] = useState<boolean>(false);
  const [showBacktesterItems, setShowBacktesterItems] =
    useState<boolean>(false);
  const isTablet = useMediaQueryCustom("(max-width: 1023px)");
  const wrapperRef = useRef(null);

  useClickOutside(wrapperRef, (_: boolean) => {
    if (isTablet) {
      setSidebarCollapsed(true);
    }
  });

  const { data } = useSession();

  const toggleCalc = () => {
    setShowCalcItems((prev) => !prev);
  };
  const toggleJournal = () => {
    setShowJournalItems((prev) => !prev);
  };
  const toggleBacktester = () => {
    setShowBacktesterItems((prev) => !prev);
  };
  const router = useRouter();

  const journalLinks = [
    {
      name: "Dashboard",
      href: "/journal/dashboard",
    },
    {
      name: "Portfolio",
      href: "/journal/portfolio",
    },
    {
      name: "Strategies",
      href: "/journal/strategy",
    },
    {
      name: "Logs",
      href: "/journal/trade-logs",
    },
  ];
  const calculatorLinks = [
    {
      name: "Strategies",
      href: "/calculator",
    },
    {
      name: "Finder",
      href: "/finder",
    },
    {
      name: "Quick Viewer",
      href: "/calculator/quick-view",
    },
  ];
  const backtesterLinks = [
    {
      name: "Previous Backtests",
      href: "/backtester/history/1",
    },
    {
      name: "Backtester",
      href: "/backtester",
    },
  ];

  const theme = {
    root: {
      base: "h-full",
      collapsed: {
        on: "w-16",
        off: "w-64",
      },
      inner:
        "h-full max-h-full overflow-y-auto overflow-x-hidden rounded bg-white py-4 px-3 dark:bg-gray-800",
    },
    collapse: {
      button:
        "group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-500 transform ease-out hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
      icon: {
        base: "h-6 w-6 text-gray-500 transition duration-500 transform ease-out group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        open: {
          off: "",
          on: "text-gray-900",
        },
      },
      label: {
        base: "ml-3 flex-1 whitespace-nowrap text-left",
        icon: {
          base: "h-6 w-6 transition ease-in-out delay-0",
          open: {
            on: "rotate-180",
            off: "",
          },
        },
      },
      list: "space-y-2 py-2",
    },
    cta: {
      base: "mt-6 rounded-lg p-4 bg-gray-100 dark:bg-gray-700",
      color: {
        blue: "bg-cyan-50 dark:bg-cyan-900",
        dark: "bg-dark-50 dark:bg-dark-900",
        failure: "bg-red-50 dark:bg-red-900",
        gray: "bg-alternative-50 dark:bg-alternative-900",
        green: "bg-green-50 dark:bg-green-900",
        light: "bg-light-50 dark:bg-light-900",
        red: "bg-red-50 dark:bg-red-900",
        purple: "bg-purple-50 dark:bg-purple-900",
        success: "bg-green-50 dark:bg-green-900",
        yellow: "bg-yellow-50 dark:bg-yellow-900",
        warning: "bg-yellow-50 dark:bg-yellow-900",
      },
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 transition duration-500 transform ease-out dark:text-white dark:hover:bg-gray-700",
      active: "bg-gray-100 dark:bg-gray-700",
      collapsed: {
        insideCollapse: "group w-full pl-8 transition duration-300",
        noIcon: "font-bold",
      },
      content: {
        base: "px-3 flex-1 whitespace-nowrap",
      },
      icon: {
        base: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-500 transform ease-out group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        active: "text-gray-700 dark:text-gray-100",
      },
      label: "",
      listItem: "",
    },
    items: {
      base: "h-full",
    },
    itemGroup: {
      base: "h-full mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700",
    },
    logo: {
      base: "mb-5 flex items-center pl-2.5",
      collapsed: {
        on: "hidden",
        off: "self-center whitespace-nowrap text-xl font-semibold dark:text-white",
      },
      img: "mr-3 h-6 sm:h-7",
    },
  };

  return (
    <>
      {!isCollapsed && isTablet && (
        <Transition
          show={!isCollapsed || !isTablet}
          enter="transition-opacity ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-50"
          leave="transition-opacity ease-in duration-500"
          leaveFrom="opacity-50"
          leaveTo="opacity-0"
        >
          <div className="fixed z-[69] h-screen w-screen bg-gray-300 opacity-50"></div>
        </Transition>
      )}

      <div ref={wrapperRef} className={`fixed z-[70]`}>
        <Transition
          show={!isCollapsed || !isTablet}
          className="z-[70]"
          enter="transition-all ease-out duration-500"
          enterFrom="-translate-x-96"
          enterTo="translate-x-0"
          leave="transition-all ease-in duration-500"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-96"
        >
          <div className=" h-screen border-r border-gray-200 ">
            <Sidebar aria-label="Default sidebar example" theme={theme}>
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <Link
                          href="/"
                          className="flex w-full cursor-pointer items-center gap-2"
                        >
                          <div className="rounded-full bg-gray-900 p-2">
                            <Image
                              src="/logo.svg"
                              alt="Options Profit Calculator Logo"
                              width={24}
                              height={24}
                            />
                          </div>
                          <span className="text-xl font-semibold">OPCALC</span>
                        </Link>
                        {isTablet && (
                          <XMarkIcon
                            onClick={() => setSidebarCollapsed(true)}
                            className="h-8 w-8 cursor-pointer"
                          />
                        )}
                      </div>
                      <button
                        onClick={toggleCalc}
                        className="mt-6 flex w-full items-center gap-1"
                      >
                        <CalculatorIcon className="h-[24px] w-[24px] scale-[1.20]" />
                        <div className="flex w-full items-center justify-between text-lg">
                          Calculator
                          <ChevronDownIcon
                            className={`h-[20px] w-[20px] transform transition-all duration-300 ${
                              showCalcItems ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>
                      {showCalcItems ? (
                        <div className="my-4 ml-4">
                          {calculatorLinks.map((link, idx) => (
                            <Transition
                              key={idx}
                              appear={true}
                              show={showCalcItems}
                              enter="transition-opacity duration-300"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition-opacity duration-300"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Sidebar.Item
                                key={idx}
                                as={Link}
                                href={link.href}
                                replace={true}
                                onClick={() => setSidebarCollapsed(true)}
                                className={
                                  "my-1 " +
                                  (router.pathname === link.href
                                    ? "bg-gray-100"
                                    : "")
                                }
                              >
                                {link.name}
                              </Sidebar.Item>
                            </Transition>
                          ))}
                        </div>
                      ) : null}

                      <button
                        onClick={toggleJournal}
                        className="my-4 flex w-full items-center gap-1"
                      >
                        <Image
                          src={`/icons/book-bookmark.svg`}
                          alt="Trade Logs"
                          width="24"
                          height="24"
                        />
                        <div className="tex-lg flex w-full items-center justify-between text-lg">
                          Journal
                          <ChevronDownIcon
                            className={`h-[20px] w-[20px] transform transition-all duration-300 ${
                              showJournalItems ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>
                      {showJournalItems ? (
                        <div className="my-4 ml-4">
                          {journalLinks.map((link, idx) => (
                            <Transition
                              key={idx}
                              appear={true}
                              show={showJournalItems}
                              enter="transition-opacity duration-300"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition-opacity duration-300"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Sidebar.Item
                                key={idx}
                                as={Link}
                                href={link.href}
                                replace={true}
                                onClick={() => setSidebarCollapsed(true)}
                                className={
                                  "my-1 " +
                                  (router.pathname === link.href
                                    ? "bg-gray-100"
                                    : "")
                                }
                              >
                                {link.name}
                              </Sidebar.Item>
                            </Transition>
                          ))}
                        </div>
                      ) : null}

                      <button
                        onClick={toggleBacktester}
                        className="my-4 flex w-full items-center gap-1"
                      >
                        <Image
                          src={`/icons/stats.svg`}
                          alt="Trade Logs"
                          width="24"
                          height="24"
                        />
                        <div className="tex-lg flex w-full items-center justify-between text-lg">
                          Backtester
                          <ChevronDownIcon
                            className={`h-[20px] w-[20px] transform transition-all duration-300 ${
                              showBacktesterItems ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>
                      {showBacktesterItems ? (
                        <div className="my-4 ml-4">
                          {backtesterLinks.map((link, idx) => (
                            <Transition
                              key={idx}
                              appear={true}
                              show={showBacktesterItems}
                              enter="transition-opacity duration-300"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition-opacity duration-300"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Sidebar.Item
                                key={idx}
                                as={Link}
                                href={link.href}
                                replace={true}
                                onClick={() => setSidebarCollapsed(true)}
                                className={
                                  "my-1 " +
                                  (router.pathname === link.href
                                    ? "bg-gray-100"
                                    : "")
                                }
                              >
                                {link.name}
                              </Sidebar.Item>
                            </Transition>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/settings"
                          className="transform rounded-lg py-2 pr-2 transition duration-500 ease-out hover:bg-gray-100"
                          onClick={() => setSidebarCollapsed(true)}
                        >
                          <div className="flex w-full items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                            Settings
                          </div>
                        </Link>
                        <div
                          onClick={() => signOut()}
                          className="flex w-full transform cursor-pointer items-center gap-2 rounded-lg p-2 pl-1 transition duration-500 ease-out hover:bg-gray-100"
                        >
                          <Image
                            src="../logout.svg"
                            alt="logout"
                            width={18}
                            height={18}
                          />
                          Log Out
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="min-w-fit">
                          <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                              <Avatar
                                alt={data?.user.name ?? "?"}
                                img={data?.user.image ?? undefined}
                                rounded
                              />
                            }
                          >
                            <Dropdown.Item>
                              Signed in as {data?.user.name ?? "?"}
                            </Dropdown.Item>
                            <Link href="/settings">
                              <Dropdown.Item>Settings</Dropdown.Item>
                            </Link>
                            <Dropdown.Item>
                              <SignOutButton />
                            </Dropdown.Item>
                          </Dropdown>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 overflow-x-hidden">
                          <span>{data?.user.name?.split(" ")?.[0]}</span>
                          <span className="w-full truncate text-sm">
                            {data?.user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </Sidebar>
          </div>
        </Transition>
      </div>
    </>
  );
}
