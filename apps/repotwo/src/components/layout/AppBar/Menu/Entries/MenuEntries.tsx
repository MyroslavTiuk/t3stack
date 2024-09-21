import React from "react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useColorMode } from "@chakra-ui/system";
import { Text, Link, Button } from "@chakra-ui/react";
import NextLink from "next/link";

const ColorModeIcon: React.FC<{
  colorMode: "light" | "dark";
  onClick?: () => void;
}> = ({ colorMode, onClick }) => {
  if (colorMode === "dark") {
    return (
      <SunIcon
        backgroundColor="cards.700"
        p={"6px"}
        borderRadius={"20px"}
        width={"26px"}
        height={"26px"}
        color="neutral.500"
        mr={"20px"}
        onClick={onClick}
      />
    );
  }
  return (
    <MoonIcon
      backgroundColor="neutral.500"
      p={"6px"}
      borderRadius={"20px"}
      width={"26px"}
      height={"26px"}
      color="cards.800"
      mr={"20px"}
      onClick={onClick}
    />
  );
};

export const DarkModeSwitch: React.FC<{ withText?: boolean }> = ({
  withText,
}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  if (!withText) {
    return <ColorModeIcon colorMode={colorMode} onClick={toggleColorMode} />;
  }

  return (
    <Button
      onClick={toggleColorMode}
      leftIcon={<ColorModeIcon colorMode={colorMode} />}
      variant="ghost"
      justifyContent="flex-start"
      mx="0"
    >
      <Text fontWeight="normal">
        {colorMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </Text>
    </Button>
  );
};

export const CalculatorMenuEntry: React.FC = () => {
  return (
    <Link as={NextLink} href="/">
      Strategy Calculators
    </Link>
  );
};

export const ScannerMenuEntry: React.FC = () => {
  return (
    <Link as={NextLink} href="/scanner">
      Option Scanner
    </Link>
  );
};

export const BacktesterMenuEntry: React.FC = () => {
  return (
    <Link as={NextLink} href="/backtester">
      Backtester
    </Link>
  );
};

export const HelpMenuEntry: React.FC = () => {
  return (
    <Link as={NextLink} href="/help">
      Help
    </Link>
  );
};
