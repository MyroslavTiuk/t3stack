import React from "react";
import { Flex } from "@chakra-ui/react";
import {
  BacktesterMenuEntry,
  CalculatorMenuEntry,
  DarkModeSwitch,
  HelpMenuEntry,
  ScannerMenuEntry,
} from "./Entries/MenuEntries";
import UserPopover from "./Entries/DesktopUserPopover";
import { featureFlags } from "@utils/featureFlags";

const DesktopMenu: React.FC = () => {
  if (featureFlags.hideScanner) {
    return (
      <Flex alignItems="center">
        <DarkModeSwitch />
      </Flex>
    );
  }

  return (
    <Flex alignItems="center" gap="5">
      <CalculatorMenuEntry />
      <ScannerMenuEntry />
      <BacktesterMenuEntry />
      <HelpMenuEntry />
      <UserPopover />
      <DarkModeSwitch />
    </Flex>
  );
};

export default DesktopMenu;
