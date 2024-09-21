import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Dropdown } from "flowbite-react";
import { useRef, type Dispatch, type SetStateAction } from "react";
import { useDimensions } from "~/utils/Hooks/useDimensions";

const TableDropDown = ({
  dropdownItems,
  selectedItem,
  setSelectedItem,
}: Props) => {
  const handleItemSelected = (item: string) => {
    setSelectedItem(item);
  };
  const ref = useRef(null);
  const { width } = useDimensions(ref);
  const displaySelectedItem =
    width < 130 && typeof selectedItem === "string" && selectedItem.length > 12
      ? `${selectedItem.slice(0, 12)}...`
      : selectedItem;

  return (
    <div className={"flex w-full max-w-[275px]"}>
      <Dropdown
        color="auto"
        label=""
        dismissOnClick={true}
        renderTrigger={() => (
          <span
            className={
              "flex w-full max-w-[148px] items-center justify-between rounded-md border	p-2 font-sans text-xs font-black uppercase "
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

export default TableDropDown;

type Props = {
  dropdownItems: string[];
  selectedItem: string;
  setSelectedItem:
    | Dispatch<SetStateAction<string>>
    | ((prevState: string) => void);
};
