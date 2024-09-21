import React, { useState } from "react";
import Dropdown from "~/components/atoms/Dropdown";
import TableDropDown from "../atoms/Dropdown";
import Button from "~/components/log/button";
import Image from "next/image";
import { FilteringModal } from "../atoms/FilteringModal";
import { StocksTable } from "./StockOnlyTable";
const dropdownOptionItems = [
  "Covered Call",
  "Cash Secured Put",
  "Iron Condor",
  "Long Call",
  "Long Put",
  "Naked Call",
  "Naked Put",
  "Call Credit Spread",
  "Put Credit Spread",
  "Call Debit Spread",
  "Put Debit Spread",
];
const TableScanner = () => {
  const [columns, setColumns] = useState([
    { title: "Price", checked: false },
    { title: "Strike", checked: true },
    { title: "Expiry", checked: false },
    { title: "Bid", checked: true },
    { title: "Ask", checked: false },
    { title: "PoP", checked: false },
    { title: "ROI", checked: true },
    { title: "Max Risk", checked: false },
    { title: "Max Profit", checked: false },
    { title: "Details", checked: false },
    { title: "Column", checked: false },
  ]);
  const [selectedItem, setSelectedItem] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);

  return (
    <div className="mx-auto max-w-7xl border border-black">
      <div className=" mx-auto flex w-full max-w-7xl items-center justify-between border-b border-black px-6 py-2">
        <div>
          <TableDropDown
            dropdownItems={dropdownOptionItems}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            className="text-sm font-medium"
            icon={
              <Image
                src={"/icons/export.svg"}
                alt="search"
                width={16}
                height={16}
              />
            }
          >
            Export
          </Button>
          <Dropdown
            className="right-[25%]"
            onChange={(col) => {
              setColumns((prev) => {
                return prev.map((v) => {
                  if (v.title == col) {
                    return { title: v.title, checked: !v.checked };
                  }
                  return v;
                });
              });
            }}
            items={columns}
          />
          <button
            className="w-full max-w-[138px] rounded-md bg-blue px-4 py-2 text-xs font-bold uppercase leading-4 text-white"
            onClick={() => setOpenModal(true)}
          >
            Start Filtering
          </button>
          <FilteringModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            openFilters={openFilters}
            setOpenFilters={setOpenFilters}
          />
        </div>
      </div>
      <StocksTable />
    </div>
  );
};

export default TableScanner;
