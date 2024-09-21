import React from "react";
import { Avatar, Button, Spinner, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { MdLogout } from "react-icons/md";

const UserMenuEntry: React.FC = () => {
  const { data, status } = useSession();
  const user = data?.user;

  return (
    <>
      <Flex gap="3" align="center">
        <Avatar
          size="xs"
          name={user?.name ?? undefined}
          src={user?.image ?? undefined}
        />

        {status === "loading" && <Spinner />}
        {status === "authenticated" &&
          `You are logged in ${user?.name ? "as " + user.name : ""}`}
        {status === "unauthenticated" && "You are not logged in"}
      </Flex>
      {status === "authenticated" ? (
        <Flex gap="3">
          <Link href="/account/me">
            <Button w="50%">My Profile</Button>
          </Link>
          <Button rightIcon={<MdLogout />} onClick={() => signOut()} w="50%">
            Log out
          </Button>
        </Flex>
      ) : (
        <Flex gap="3">
          <Link href="/account/login">
            <Button w="50%">Log in</Button>
          </Link>
          <Link href="/account/create">
            <Button w="50%">Subscribe</Button>
          </Link>
        </Flex>
      )}
    </>
  );
};

export default UserMenuEntry;
