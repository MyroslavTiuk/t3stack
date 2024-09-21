import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Button from "./button";
import Checkbox from "./Checkbox";

type Props = {
  items: { title: string; checked: boolean }[];
  onChange: (title: string) => void;
};

export default function Dropdown({ items, onChange }: Props) {
  return (
    <Menu as="div">
      <Menu.Button as="div">
        <Button
          className="text-sm font-medium"
          variant="secondary"
          icon={<ChevronDownIcon className="h-6 w-6" />}
        >
          Columns
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
        <Menu.Items className="absolute right-1 z-50 mt-2 flex w-56 origin-top-right flex-col gap-2 rounded-md bg-white p-3 shadow-lg ring-1 ring-black/5 focus:outline-none">
          <p className="text-sm font-medium text-gray-900">Select Columns</p>
          {items.map((item) => (
            <Checkbox
              key={item.title}
              id={item.title}
              checked={item.checked}
              title={item.title}
              onChange={() => {
                onChange(item.title);
              }}
            />
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
