import { Datepicker } from "flowbite-react";

import Image from "next/image";

type Props = {
  id?: string;
  type?: string;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  left?: boolean;
};
export function SingleDatePicker({ setSelectedDate, left = false }: Props) {
  const theme = {
    root: {
      base: "relative",
    },
    popup: {
      root: {
        base: `absolute top-10 ${left ? "left-0" : "right-0"} z-50 block pt-2`,
        inline: "relative top-0 z-auto",
        inner:
          "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700",
      },
      header: {
        title:
          "px-2 py-3 text-center font-semibold text-gray-900 dark:text-white",
      },
      footer: {
        base: "flex mt-2 space-x-2",
        button: {
          base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-black",
          today:
            "bg-black text-white hover:bg-black dark:bg-gray-600 dark:hover:bg-black",
          clear:
            "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
        },
      },
    },
    views: {
      days: {
        header: {
          base: "grid grid-cols-7 mb-1",
          title:
            "dow h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400",
        },
        items: {
          base: "grid w-64 grid-cols-7",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 ",
            selected: "bg-black text-white hover:bg-gray-600",
            disabled: "text-gray-500",
          },
        },
      },
      months: {
        items: {
          base: "grid w-64 grid-cols-4",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
            selected: "bg-black text-white hover:bg-gray-600",
            disabled: "text-gray-500",
          },
        },
      },
      years: {
        items: {
          base: "grid w-64 grid-cols-4",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 text-gray-900",
            selected: "bg-black text-white hover:bg-gray-600",
            disabled: "text-gray-500",
          },
        },
      },
      decades: {
        items: {
          base: "grid w-64 grid-cols-4",
          item: {
            base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9  hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 text-gray-900",
            selected: "bg-black text-white hover:bg-gray-600",
            disabled: "text-gray-500",
          },
        },
      },
    },
  };

  return (
    <Datepicker
      className="!focus:ring-black"
      onSelectedDateChanged={setSelectedDate}
      style={{ height: 42, backgroundColor: "white" }}
      theme={theme}
      icon={() => (
        <Image
          src="/calendar-month.svg"
          width={15}
          height={15}
          className="ml-2"
          alt="TD Ameritrade Logo"
        />
      )}
    />
  );
}
