import { useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Dropdown } from "flowbite-react";
import { type Dispatch, type SetStateAction } from "react";
import { useDimensions } from "~/utils/Hooks/useDimensions";

const BackTestDropDown = ({
  dropdownItems,
  selectedItem,
  setSelectedItem,
}: Props) => {
  const ref = useRef(null);
  const { width } = useDimensions(ref);
  const handleItemSelected = (item: string) => {
    setSelectedItem(item);
  };

  const displaySelectedItem =
    width < 130 && typeof selectedItem === "string" && selectedItem.length > 8
      ? `${selectedItem.slice(0, 8)}...`
      : selectedItem;

  return (
    <div ref={ref} className={"flex h-full max-h-7 w-full max-w-[275px]"}>
      <Dropdown
        color="auto"
        label=""
        dismissOnClick={true}
        renderTrigger={() => (
          <span
            className={
              "flex h-full max-h-7 w-full max-w-[275px] items-center justify-between rounded-md border border-gray-300 bg-gray-50 p-2 text-xs font-normal text-[#505050]"
            }
          >
            {displaySelectedItem || "Select"}
            <ChevronDownIcon className="h-5 w-5" />
          </span>
        )}
      >
        {dropdownItems.map((item, index) => (
          <Dropdown.Item
            key={index}
            className={
              "flex w-full max-w-[275px] items-center gap-1 text-xs font-normal text-[#505050]"
            }
            onClick={() => handleItemSelected(item)}
          >
            {item}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};

export default BackTestDropDown;

type Props = {
  dropdownItems: string[];
  selectedItem: string;
  setSelectedItem:
    | Dispatch<SetStateAction<string>>
    | ((prevState: string) => void);
};
