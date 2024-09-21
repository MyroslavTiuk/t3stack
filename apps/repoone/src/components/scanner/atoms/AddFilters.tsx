import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Modal } from "flowbite-react";

import React, { useRef, useState } from "react";
import useOnClickOutside from "~/utils/Hooks/useClickOutside";
import { initialAllData } from "../mocked";
const theme = {
  root: {
    base: "fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
    show: {
      on: "flex backdrop-opacity-10 backdrop-invert bg-white/30",
      off: "hidden",
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

interface CheckboxItem {
  title: string;
  checked: boolean;
}

interface AddFiltersProps {
  openFilters: boolean;
  setOpenFilters: React.Dispatch<React.SetStateAction<boolean>>;
}
const renderCheckboxes = (
  category: string,
  items: CheckboxItem[],
  onCheckboxChange: (category: string, title: string, checked: boolean) => void,
  onSelectAll: () => void,
  onClearAll: () => void
) => {
  const formatCategoryName = (category: string): string => {
    // Convert camelCase to title case
    return category
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (word) => word.toUpperCase());
  };

  const formattedCategory = formatCategoryName(category);

  const formatCategoryFilters = (category: string): string => {
    return category
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (word) => word.toLowerCase());
  };

  const formattedFilters = formatCategoryFilters(category);
  return (
    <div key={category} className="mt-4">
      <h2 className="mb-2 text-lg font-bold leading-5">{formattedCategory}</h2>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <label key={item.title} className="flex items-center">
            <input
              type="checkbox"
              checked={item.checked}
              className="mr-2"
              onChange={(event) =>
                onCheckboxChange(category, item.title, event.target.checked)
              }
            />
            {item.title}
          </label>
        ))}
        <div className="items center col-span-3 mb-2 flex gap-2">
          <button
            className="text-red-500 underline hover:underline focus:outline-none"
            onClick={onSelectAll}
          >
            Select all {formattedFilters} filters
          </button>
          <button onClick={onClearAll}>Clear</button>
        </div>
      </div>
    </div>
  );
};

export const AddFilters: React.FC<AddFiltersProps> = ({
  openFilters,
  setOpenFilters,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleModalClick = (event: Event) => {
    if (ref.current && event.target instanceof Node) {
      setOpenFilters(false);
    }
  };
  const [searchText, setSearchText] = useState("");
  const [allData, setAllData] = useState(initialAllData);
  useOnClickOutside(ref, handleModalClick);
  const handleCheckboxChange = (
    category: string,
    title: string,
    checked: boolean
  ) => {
    const updatedData = {
      ...allData,
      [category]: allData[category].map((item) =>
        item.title === title ? { ...item, checked } : item
      ),
    };
    setAllData(updatedData);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  // Filter checkboxes based on the search text
  const filteredData = Object.entries(allData).reduce(
    (acc, [category, items]) => {
      const filteredItems = items.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );

      if (filteredItems.length > 0) {
        acc[category] = filteredItems;
      }

      return acc;
    },
    {} as { [key: string]: CheckboxItem[] }
  );
  return (
    <Modal
      ref={ref}
      size={"3xl"}
      theme={theme}
      show={openFilters}
      onClose={() => setOpenFilters(false)}
      className=""
    >
      <Modal.Body className="h-full max-h-[814px] w-full max-w-[786px] overflow-y-auto">
        <div className="flex items-center justify-between font-sans">
          <h1 className="text-lg font-bold leading-5">Options Filters</h1>
          <div className="relative flex">
            <MagnifyingGlassIcon className="absolute left-4 top-3 h-4 w-4 cursor-pointer" />
            <input
              type="text"
              placeholder="Search for filters..."
              className="w-[550px] rounded-md py-2 pl-10 pr-2"
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        {Object.entries(filteredData).map(([category, items]) =>
          renderCheckboxes(
            category,
            items,
            handleCheckboxChange,
            () => {
              const updatedData = {
                ...allData,
                [category]: allData[category].map((item) => ({
                  ...item,
                  checked: true,
                })),
              };
              setAllData(updatedData);
            },
            () => {
              const updatedData = {
                ...allData,
                [category]: allData[category].map((item) => ({
                  ...item,
                  checked: false,
                })),
              };
              setAllData(updatedData);
            }
          )
        )}
      </Modal.Body>
    </Modal>
  );
};
