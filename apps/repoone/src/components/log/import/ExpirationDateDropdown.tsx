import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";

export type ExpirationDate = {
  date: Date;
  type: string;
};

export function formatDate(date: Date): string {
  const formattedDate = date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
  const startDate = new Date();
  startDate.setHours(0, 0, 0);
  // @ts-ignore
  const timeDifference = date - startDate;
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

  return formattedDate + ` (${daysDifference.toFixed(0)}d)`;
}

export type ExpirationDateDropDownProps = {
  dates: Date[] | undefined;
  setDate: (date: Date) => void;
  selected: Date | null;
  onOpen: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function ExpirationDateDropDown({
  dates,
  setDate,
  onOpen,
  selected,
  isLoading = false,
}: ExpirationDateDropDownProps) {
  return (
    <Listbox value={selected} onChange={setDate}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button
            onClick={(e) => {
              onOpen();
              if (!dates) {
                e.preventDefault();
              }
            }}
            // className="rounded-md border-gray-200 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400"
            className="relative w-[170px] cursor-pointer rounded-md border border-gray-200 bg-white py-2 pl-3 pr-10 text-left text-lg font-medium !leading-6 focus:border-none focus:outline-none focus:ring-2 focus:ring-gray-400 sm:text-sm"
          >
            <span className="block truncate">
              {selected ? `Expiring ${formatDate(selected)}` : "Select Expiry"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              {isLoading ? (
                <svg
                  aria-hidden="true"
                  className="fill-blue-600 h-5 w-5 animate-spin text-gray-200 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="secondary"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : open ? (
                <ChevronUpIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              ) : (
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              )}
            </span>
          </Listbox.Button>
          {dates && dates.length > 0 && (
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-[170px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {dates.map((date, idx) => (
                  <Listbox.Option
                    key={idx}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? "bg-gray-900 text-white" : "text-gray-900"
                      }`
                    }
                    value={date}
                  >
                    {({ selected: isSelected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            isSelected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {formatDate(date)}
                        </span>
                        {isSelected ||
                        date.toDateString() == selected?.toDateString() ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          )}
        </div>
      )}
    </Listbox>
  );
}
