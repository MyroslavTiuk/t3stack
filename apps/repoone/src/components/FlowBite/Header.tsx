import { useSession } from "next-auth/react";
import React from "react";
import SignOutButton from "../layout/header/signOutButton";
import Link from "next/link";
import { Avatar, Dropdown } from "flowbite-react";
import { useMediaQueryCustom } from "~/utils/Hooks/useMediaQueryCustom";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";

type HeaderProps = {
  toggleSidebar: () => void;
};

const HeaderComponent: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { data } = useSession();
  const isTablet = useMediaQueryCustom("(max-width: 1023px)");
  const routerPath = usePathname();

  if (!isTablet) {
    return <></>;
  }

  const routes = {
    journal: "Options Journal",
    backtester: "Backtester Calculator",
    finder: "Options Finder",
    calculator: "Options Profit Calculator",
    settings: "Settings",
  };

  return (
    <header>
      <nav
        className="hover:text-bold focus:text-bold fixed right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-5 py-3"
        style={{ width: `calc(100% - ${isTablet ? "0px" : "257px"})` }}
      >
        <div className="flex items-center gap-4">
          {isTablet && (
            <button
              onClick={toggleSidebar}
              className="justify-center rounded-lg p-3 hover:bg-gray-200"
            >
              <Bars3Icon className="h-8 w-8" />
              {/*<Image src="../logout.svg" alt="logout" width={18} height={18} />*/}
            </button>
          )}
          <span className="text-2xl">
            {routes[Object.keys(routes).find((r) => routerPath.includes(r))]}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex w-fit items-center gap-4 sm:gap-10">
            <span className="h-[70%] w-[2px] bg-gray-300"></span>
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt={data?.user.name ?? "?"}
                  img={data?.user.image ?? undefined}
                  rounded
                  className="w-fit"
                />
              }
            >
              <Dropdown.Item>
                Signed in as {data?.user.name ?? "?"}
              </Dropdown.Item>
              <Link href="/settings">
                <Dropdown.Item>Settings</Dropdown.Item>
              </Link>
              <Dropdown.Item>
                <SignOutButton />
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;
