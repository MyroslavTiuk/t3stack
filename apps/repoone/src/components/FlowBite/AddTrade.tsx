import { Modal, Tabs } from "flowbite-react";
import Image from "next/image";

// @ts-ignore
import AddTransactionsLast from "../log/import/addTransactionsLast";
import React from "react";
import AddEquity from "~/components/log/import/AddEquity";
const theme = {
  root: {
    base: "fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
    show: {
      on: "flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80",
      off: "hidden",
    },
    sizes: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "w-[456px]",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
    },
  },
  content: {
    base: "relative h-full w-full p-4 md:h-auto",
    inner:
      "relative rounded-lg bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh]",
  },
  body: {
    base: "p-4 flex-1 overflow-auto",
    popup: "pt-0",
  },
  header: {
    base: "flex items-start justify-between rounded-t dark:border-gray-600 border-b p-5",
    popup: "p-2 border-b-0",
    title: "text-xl font-medium text-gray-900 dark:text-white",
    close: {
      base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
      icon: "h-5 w-5",
    },
  },
  footer: {
    base: "flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600",
    popup: "border-t",
  },
};

const tabsTheme = {
  tablist: {
    base: "flex align-center",
    tabitem: {
      base: "flex items-center justify-center p-4 rounded-t-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 w-2xl",
      styles: {
        width: "200px", // Set the width here
        underline: {
          base: "rounded-t-lg",
          active: {
            on: "rounded-t-lg border-b-2 active border-black w-1/2",
            off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 w-1/2",
          },
        },
      },
    },
  },
};

interface AddTradeProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  // Add any other props specific to the AddTrade component here
}
export const AddTrade: React.FC<AddTradeProps> = ({
  openModal,
  setOpenModal,
}) => {
  return (
    <Modal
      size={"lg"}
      theme={theme}
      show={openModal}
      onClose={() => setOpenModal(false)}
    >
      <Modal.Body>
        <div className="flex items-center justify-between">
          <h1 className="text-xl leading-7">Add Trade</h1>
          <Image
            onClick={() => setOpenModal(false)}
            src={"../../../icons/x-outline.svg"}
            alt="a"
            width={12}
            height={12}
            className="cursor-pointer"
          />
        </div>
        <Tabs
          theme={tabsTheme}
          aria-label="Tabs with underline"
          style="underline"
          className="m-auto !mx-0 focus:outline-none"
        >
          <Tabs.Item title="Options" className="w-1/2">
            {/* <Options />  */}
            <AddTransactionsLast setModalOpen={setOpenModal} />
          </Tabs.Item>
          <Tabs.Item title="Equity">
            <AddEquity setModalOpen={setOpenModal} />
          </Tabs.Item>
        </Tabs>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={() => setOpenModal(false)}>I accept</Button>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Decline
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};
