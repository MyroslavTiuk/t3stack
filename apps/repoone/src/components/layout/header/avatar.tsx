import React from "react";
import Image from "next/image";
import { Menu } from "@headlessui/react";
import SignOutButton from "./signOutButton";
import Link from "next/link";

const Avatar: React.FC<{ imageUrl?: string; userName: string }> = ({
  imageUrl,
  userName,
}) => {
  return (
    <Menu>
      <Menu.Button>
        {imageUrl ? (
          <Image
            src={imageUrl}
            className="my-auto mr-2 hidden w-10 self-end rounded-full sm:block"
            alt="userName.at(0)"
            height={48}
            width={48}
          />
        ) : (
          <p className="align-center my-auto mr-2 h-10 w-10 rounded-full bg-orange leading-10 text-white">
            {userName.at(0)}
          </p>
        )}
      </Menu.Button>
      <Menu.Items className="align-center absolute right-5 top-14 flex w-56 origin-top-right flex-wrap justify-center gap-3 rounded-md bg-neutral-50 p-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <p>Signed in as {userName}</p>
        <Menu.Item>
          <Link
            className="flex w-full justify-center rounded-lg border-2 border-orange py-3 font-semibold text-orange no-underline drop-shadow transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10"
            href="/settings"
          >
            Settings
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SignOutButton />
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default Avatar;
