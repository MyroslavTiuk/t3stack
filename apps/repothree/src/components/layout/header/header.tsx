import { useSession } from "next-auth/react";
import React from "react";
import { useState } from "react";
import LinkList from "./links";
import SignOutButton from "./signOutButton";
import HamburgerButton from "./hamburgerButton";
import Avatar from "./avatar";
import Image from "next/image";
import Link from "next/link";

const Header: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { data } = useSession();

  return (
    <header>
      <nav className="hover:text-bold focus:text-bold fixed top-0 z-20 flex h-16 w-full items-center justify-between bg-white  py-2 text-neutral-600 shadow-md">
        <Image
          className="ml-2"
          src="/android-chrome-192x192.png"
          alt="Track Greeks Logo"
          width={40}
          height={40}
        />
        <p className="ml-2 text-lg font-extrabold tracking-tight text-teal-600">
          Track Greeks
        </p>
        <HamburgerButton onClick={() => setShowMenu(!showMenu)} />
        <div className="mx-auto hidden sm:flex">
          <LinkList />
        </div>
        <Avatar
          userName={data?.user.name ?? "?"}
          imageUrl={data?.user.image ?? undefined}
        />
      </nav>
      <div
        className={`${
          showMenu ? "flex flex-wrap" : "hidden"
        } fixed top-16 z-20 h-screen  w-full bg-neutral-50 sm:hidden`}
      >
        <LinkList onClick={() => setShowMenu(false)} />
        <div className="flex w-full flex-col gap-2 px-2">
          <p>Signed in as {data?.user.name ?? "?"}</p>
          <div className="flex h-10 w-full items-center justify-center gap-2">
            <Link
              className="flex w-full justify-center rounded-lg border-2 border-teal-600 py-3 font-semibold text-teal-600 no-underline drop-shadow transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10"
              href="/settings"
              onClick={() => setShowMenu(false)}
            >
              Settings
            </Link>
            <SignOutButton />
          </div>
        </div>
      </div>
      {/* Spacer */}
      <div className="h-16 w-full" />
    </header>
  );
};

export default Header;
