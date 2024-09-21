import React, { useRef } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Avatar,
  Button,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverHeader,
  Spinner,
  Divider,
  Text,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const UserPopover: React.FC = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const loginRef = useRef(null);

  const { data, status } = useSession();
  const user = data?.user;

  function handleLogOut() {
    signOut();
    onClose();
  }

  return (
    <Popover
      preventOverflow
      isOpen={isOpen}
      initialFocusRef={loginRef}
      onOpen={onOpen}
      onClose={onClose}
    >
      <PopoverTrigger>
        <Avatar
          size="xs"
          name={user?.name ?? undefined}
          src={user?.image ?? undefined}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          {status === "loading" && <Spinner />}
          {status === "authenticated" &&
            `You are logged in ${user?.name ? "as " + user.name : ""}`}
          {status === "unauthenticated" && "You are not logged in"}
        </PopoverHeader>
        <PopoverBody>
          {status === "authenticated" ? (
            <>
              <Link href="/account/me">
                <Button onClick={onClose} w="full">
                  My Profile
                </Button>
              </Link>
              <Divider my={2} />
              <Button onClick={handleLogOut} w="full">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/account/login">
                <Button w="full" my={2} ref={loginRef} onClick={onClose}>
                  Log in
                </Button>
              </Link>
              <Flex align="center">
                <Divider />
                <Text p="2">or</Text>
                <Divider />
              </Flex>
              <Link href="/account/create">
                <Button w="full" mt={2} onClick={onClose}>
                  Subscribe
                </Button>
              </Link>
            </>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;
