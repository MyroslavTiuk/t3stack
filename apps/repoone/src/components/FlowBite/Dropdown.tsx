// DropdownComponent.tsx
import React, { useState } from "react";
import { Dropdown } from "flowbite-react";
import Image from "next/image";
import { AddTrade } from "./AddTrade";
import CsvDialog from "../log/import/csv/dialog";

interface DropdownComponentProps {
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  text: string;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  icon,
  bgColor,
  textColor,
  text,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);

  return (
    <>
      <Dropdown
        color="auto"
        label=""
        dismissOnClick={true}
        renderTrigger={() => (
          <span
            className={`flex items-center justify-center rounded-lg px-3 py-2 ${
              bgColor ? `bg-${bgColor}` : ""
            } text-${textColor}`}
          >
            {icon} {text}
          </span>
        )}
      >
        <Dropdown.Item className="flex items-center gap-1">
          <Image
            src={"/icons/DropdownIcons/file-import.svg"}
            alt="s"
            width={14}
            height={14}
          />{" "}
          Import Broker
        </Dropdown.Item>
        <Dropdown.Item
          className="flex items-center gap-1"
          onClick={() => setIsCsvDialogOpen(true)}
        >
          <Image
            src={"/icons/DropdownIcons/file-csv.svg"}
            alt="s"
            width={14}
            height={14}
          />{" "}
          CSV Import
        </Dropdown.Item>
        <div className="my-1 border-t"></div>
        {/* <Dropdown.Item className="flex items-center gap-1"> */}
        {/* </Dropdown.Item> */}
        <Dropdown.Item
          className="flex items-center gap-1 text-black"
          onClick={() => setOpenModal(true)}
        >
          <Image
            src={"/icons/DropdownIcons/plus.svg"}
            alt="s"
            width={14}
            height={14}
          />
          Add Manually
        </Dropdown.Item>
      </Dropdown>
      <AddTrade openModal={openModal} setOpenModal={setOpenModal} />
      <CsvDialog
        isOpen={isCsvDialogOpen}
        onClose={() => setIsCsvDialogOpen(false)}
      />
    </>
  );
};

export default DropdownComponent;
