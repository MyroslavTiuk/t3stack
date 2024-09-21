import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Dropdown } from "flowbite-react";
import { type Dispatch, type SetStateAction } from "react";

const ModalDropDown = ({
  dropdownItems,
  selectedItem,
  setSelectedItem,
}: Props) => {
  const handleItemSelected = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <div className="flex w-[111px]">
      <Dropdown
        color="auto"
        label=""
        dismissOnClick={true}
        renderTrigger={() => (
          <span
            className={
              "flex w-[111px] items-center justify-between rounded-md border border-[#424262]	p-1 font-sans text-xs "
            }
          >
            {selectedItem || "Select"}
            <ChevronDownIcon className="h-5 w-5" />
          </span>
        )}
      >
        {dropdownItems.map((item, index) => (
          <Dropdown.Item
            key={index}
            className={
              "flex w-[111px] items-center gap-1 text-xs font-normal text-[#505050]"
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

export default ModalDropDown;

type Props = {
  dropdownItems: string[];
  selectedItem: string;
  setSelectedItem:
    | Dispatch<SetStateAction<string>>
    | ((prevState: string) => void);
};
