import { Flex } from "@chakra-ui/layout";
import Logo from "@atoms/Logo";
import Link from "next/link";
import { useBreakpointValue, useColorModeValue } from "@chakra-ui/react";

import MobileMenu from "./Menu/MobileMenu";
import DesktopMenu from "./Menu/DesktopMenu";

export const headerHeight = "80px";

export const AppBar = () => {
  const backgroundColor = useColorModeValue("background.50", "background.800");
  const isSmallScreen = useBreakpointValue({ base: true, md: false });
  return (
    <Flex
      backgroundColor={backgroundColor}
      height={headerHeight}
      width={"100%"}
      zIndex={200}
      justifyContent="space-between"
      px={{ base: "20px", lg: "40px" }}
      position="fixed"
      top={0}
    >
      <Flex alignItems="center">
        <Link href="/">
          <Logo />
        </Link>
      </Flex>
      {isSmallScreen ? <MobileMenu /> : <DesktopMenu />}
    </Flex>
  );
};
