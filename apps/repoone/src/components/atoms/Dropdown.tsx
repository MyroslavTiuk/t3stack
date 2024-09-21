import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Button from "~/components/log/button";
import Checkbox from "~/components/atoms/Checkbox";

type Props = {
  items: { title: string; checked: boolean }[];
  onChange: (title: string) => void;
  className?: string;
};

export default function Dropdown({ items, onChange, className }: Props) {
  return (
    <Menu as="div">
      <Menu.Button as="div">
        <Button
          rightIcon
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
        <Menu.Items
          className={`${className} absolute right-1 mt-2 flex w-56 origin-top-right flex-col gap-2 rounded-md bg-white p-3 shadow-lg ring-1 ring-black/5 focus:outline-none`}
        >
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
