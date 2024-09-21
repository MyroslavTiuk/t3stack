import { useSession } from "next-auth/react";
import React from "react";
import SignOutButton from "../layout/header/signOutButton";
import Image from "next/image";
import Link from "next/link";
import { Avatar, Dropdown } from "flowbite-react";

const HeaderComponent: React.FC = () => {
  // const [showMenu, setShowMenu] = useState(false);
  const { data } = useSession();

  return (
    <header>
      <nav className="hover:text-bold focus:text-bold fixed top-0 z-[6000] flex h-16 w-full items-center justify-between bg-dark px-5 py-3 text-white shadow-md">
        <div className="ml-2">
          <Image
            src="/logo.svg"
            alt="Options Profit Calculator Logo"
            width={40}
            height={40}
          />
        </div>
        <div className="flex gap-2">
          {/* <Image
            src={"/icons/HeaderIcons/notification-icon.svg"}
            alt="s"
            width={28}
            height={28}
          />{" "}
          <Image
            src={"/icons/HeaderIcons/apps-icon.svg"}
            alt="a"
            width={32}
            height={32}
          /> */}
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt={data?.user.name ?? "?"}
                img={data?.user.image ?? undefined}
                rounded
              />
            }
          >
            <Dropdown.Item>Signed in as {data?.user.name ?? "?"}</Dropdown.Item>
            <Link href="/settings">
              <Dropdown.Item>Settings</Dropdown.Item>
            </Link>
            <Dropdown.Item>
              <SignOutButton />
            </Dropdown.Item>
          </Dropdown>
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;
