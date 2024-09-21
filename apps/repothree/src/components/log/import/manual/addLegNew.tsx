import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const AddLegNew: React.FC<Props> = ({ actions }) => {
  return (
    <Menu as="div">
      <div>
        <Menu.Button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 no-underline drop-shadow transition duration-150 ease-in-out hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:bg-blue/50 md:px-2">
          <span className="sr-only">Open options</span>
          <Image
            src={"../../../icons/plus.svg"}
            alt="a"
            width={20}
            height={20}
          />
          <span>Add another leg</span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {actions.map((action) => (
              <Menu.Item key={action.label}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={action.onClick}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block w-full px-4 py-2 text-left text-sm"
                    )}
                  >
                    {action.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

type Props = { actions: { label: string; onClick: () => void }[] };

export default AddLegNew;
