import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/react/24/solid";
import { AddTrade } from "~/components/FlowBite/AddTrade";
import CsvDialog from "~/components/log/import/csv/dialog";
import ImportBroker from "~/components/FlowBite/ImportBroker";
import Button from "~/components/atoms/button";
export default function ImportTradesDropdown() {
  const [openModal, setOpenModal] = useState(false);
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);
  const [isTdDialogOpen, setIsTdDialogOpen] = useState(false);

  return (
    <>
      <AddTrade openModal={openModal} setOpenModal={setOpenModal} />
      <CsvDialog
        isOpen={isCsvDialogOpen}
        onClose={() => setIsCsvDialogOpen(false)}
      />
      <ImportBroker
        isOpen={isTdDialogOpen}
        onClose={() => setIsTdDialogOpen(false)}
      />
      <Menu as="div">
        <Menu.Button as="div">
          <Button icon={<ArrowDownTrayIcon className="h-[12px] w-[12px]" />}>
            Import Trades
          </Button>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-1 z-50 mt-2 flex w-56 origin-top-right flex-col rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <Menu.Item>
              <button
                onClick={() => setIsTdDialogOpen(true)}
                className="group flex w-full items-center gap-2 rounded-t-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
              >
                <svg
                  className="h-4 w-4 text-black hover:text-white"
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.31265 3.5V0.0910001C4.95685 0.185485 4.63225 0.366004 4.36987 0.6153L2.30785 2.5949C2.04817 2.8468 1.86014 3.15843 1.76172 3.5H5.31265Z"
                    fill="#374151"
                  />
                  <path
                    d="M11.9238 0H6.77094V3.5C6.77094 3.8713 6.6173 4.2274 6.34381 4.48995C6.07033 4.7525 5.69941 4.9 5.31265 4.9H1.66693V7.7H7.0728L6.29991 6.9573C6.23027 6.89273 6.17472 6.81549 6.13651 6.73008C6.09829 6.64468 6.07818 6.55283 6.07734 6.45988C6.0765 6.36694 6.09495 6.27476 6.13161 6.18873C6.16827 6.10271 6.22241 6.02455 6.29087 5.95882C6.35933 5.8931 6.44074 5.84112 6.53035 5.80592C6.61996 5.77073 6.71598 5.75302 6.81279 5.75382C6.90961 5.75463 7.00528 5.77394 7.09424 5.81063C7.1832 5.84732 7.26366 5.90064 7.33092 5.9675L9.34919 7.9051C9.48588 8.03637 9.56267 8.21439 9.56267 8.4C9.56267 8.58562 9.48588 8.76363 9.34919 8.8949L7.33092 10.8325C7.1934 10.96 7.00922 11.0306 6.81804 11.029C6.62686 11.0274 6.44398 10.9538 6.30879 10.824C6.1736 10.6942 6.09692 10.5186 6.09526 10.3351C6.0936 10.1515 6.16709 9.97472 6.29991 9.8427L7.0728 9.1H1.66693V12.6C1.66088 12.965 1.80588 13.3173 2.07011 13.5798C2.33434 13.8422 2.69622 13.9934 3.07637 14H11.9238C12.3039 13.9934 12.6658 13.8422 12.9301 13.5798C13.1943 13.3173 13.3393 12.965 13.3332 12.6V1.4C13.3393 1.03504 13.1943 0.68267 12.9301 0.420209C12.6658 0.157749 12.3039 0.00662745 11.9238 0Z"
                    fill="#374151"
                  />
                </svg>
                Import Broker
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => setIsCsvDialogOpen(true)}
                className="group flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 duration-75 hover:bg-gray-300 hover:transition-colors"
              >
                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_303_1040)">
                    <path
                      d="M12.4 12.6C12.4 12.6 2.6 12.2136 2.6 12.6C2.6 12.9864 2.8926 13.3 3.2531 13.3H11.7462C12.1074 13.3 12.4 12.9864 12.4 12.6Z"
                      fill="#374151"
                    />
                    <path
                      d="M5.4 3.5V0.0910001C5.0626 0.1876 4.7497 0.3598 4.4949 0.6153L2.5153 2.5949C2.2598 2.8497 2.0876 3.1626 1.991 3.5H5.4Z"
                      fill="#374151"
                    />
                    <path
                      d="M13.8 4.9H13.0496C13.0804 4.8209 13.1 4.7369 13.1 4.6473V1.4C13.1 0.6279 12.4931 0 11.7469 0H6.8V3.5C6.8 4.2721 6.1721 4.9 5.4 4.9H1.2C0.8136 4.9 0.5 5.2136 0.5 5.6V11.9C0.5 12.2864 0.8136 12.6 1.2 12.6H1.9C1.9 13.3721 2.5069 14 3.2531 14H11.7469C12.4931 14 13.1 13.3721 13.1 12.6H13.8C14.1864 12.6 14.5 12.2864 14.5 11.9V5.6C14.5 5.2136 14.1864 4.9 13.8 4.9ZM3.7529 9.8H4.4655C4.8519 9.8 5.1655 10.1136 5.1655 10.5C5.1655 10.8864 4.8519 11.2 4.4655 11.2H3.7529C2.7316 11.2 1.9 10.3691 1.9 9.3471V8.1529C1.9 7.1316 2.7316 6.3 3.7529 6.3H4.4655C4.8519 6.3 5.1655 6.6136 5.1655 7C5.1655 7.3864 4.8519 7.7 4.4655 7.7H3.7529C3.503 7.7 3.3 7.903 3.3 8.1529V9.3471C3.3 9.597 3.503 9.8 3.7529 9.8ZM9.2612 10.2025C9.0302 10.8647 8.4926 11.2 7.6645 11.2H6.8763C6.4899 11.2 6.1763 10.8864 6.1763 10.5C6.1763 10.1136 6.4899 9.8 6.8763 9.8H7.6645C7.8752 9.8 7.9347 9.7685 7.9368 9.7671C7.9585 9.6866 7.9725 9.6187 7.9557 9.5914C7.9291 9.5494 7.8213 9.4822 7.6659 9.4654L7.29 9.4241C6.4087 9.3275 5.7752 8.5603 5.848 7.6755C5.9194 6.8166 6.6453 6.2041 7.5014 6.1789L8.1734 6.1929C8.5598 6.2013 8.8664 6.5212 8.8587 6.9076C8.8503 7.2947 8.5185 7.6132 8.144 7.5929L7.4818 7.5789H7.4804C7.3593 7.5789 7.2529 7.6699 7.2431 7.791C7.2326 7.9128 7.3201 8.0185 7.4419 8.0318L7.8171 8.0731C8.3785 8.134 8.872 8.4224 9.1387 8.8438C9.3872 9.2358 9.4299 9.7181 9.2612 10.2025ZM13.0657 7.217L11.9758 10.5574C11.882 10.8458 11.6132 11.0404 11.3101 11.0404C11.308 11.0404 11.3052 11.0404 11.3024 11.0404C10.9965 11.0369 10.7284 10.836 10.6402 10.5434L9.6301 7.203C9.5181 6.8327 9.7274 6.4421 10.097 6.3301C10.468 6.2181 10.8579 6.4274 10.9699 6.797L11.3353 8.0059L11.7343 6.783C11.854 6.4162 12.2481 6.2146 12.617 6.3343C12.9845 6.4547 13.1854 6.8495 13.0657 7.217Z"
                      fill="#374151"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_303_1040">
                      <rect
                        width="14"
                        height="14"
                        fill="white"
                        transform="translate(0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                CSV Import
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => setOpenModal(true)}
                className="border-t-1 group flex w-full items-center gap-2 rounded-b-md border-t-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
              >
                <PlusIcon className="h-4 w-4" />
                Add Manually
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
