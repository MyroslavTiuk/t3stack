import React from "react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Divider,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  CalculatorMenuEntry,
  ScannerMenuEntry,
  HelpMenuEntry,
  DarkModeSwitch,
  BacktesterMenuEntry,
} from "./Entries/MenuEntries";
import { headerHeight } from "../AppBar";
import UserMenuEntry from "./Entries/MobileUserMenuEntry";
import { featureFlags } from "@utils/featureFlags";

const MobileMenu: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (featureFlags.hideScanner) {
    return (
      <Flex alignItems="center">
        <DarkModeSwitch />
      </Flex>
    );
  }

  return (
    <Flex alignItems="center">
      <IconButton
        aria-label="Open/Close Menu"
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        onClick={() => (isOpen ? onClose() : onOpen())}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
        <DrawerOverlay mt={headerHeight} />
        <DrawerContent mt={headerHeight} onClick={onClose}>
          <Flex direction="column" gap="5" p="5">
            <Divider />
            <CalculatorMenuEntry />
            <ScannerMenuEntry />
            <BacktesterMenuEntry />
            <HelpMenuEntry />
            <Divider />
            <UserMenuEntry />
            <Divider />
            <DarkModeSwitch withText={true} />
          </Flex>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default MobileMenu;
