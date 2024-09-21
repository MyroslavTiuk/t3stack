import React from "react";
import { Flex, Text } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";
import { featureFlags } from "@utils/featureFlags";

const Logo: React.FC = () => {
  const highlightColor = useColorModeValue("primary.200", "primary.500");

  if (featureFlags.hideScanner) {
    return (
      <Flex alignItems="center">
        <Text fontSize={20} fontWeight={500}>
          Option
        </Text>
        <Text fontSize={20} fontWeight={800} color={highlightColor}>
          Scout
        </Text>
      </Flex>
    );
  }

  return (
    <Flex>
      <Text fontSize={20} fontWeight={500} mr="1">
        Options
      </Text>
      <Text fontSize={20} fontWeight={800} color={highlightColor} mr="1">
        Profit
      </Text>
      <Text fontSize={20} fontWeight={500}>
        Calculator
      </Text>
    </Flex>
  );
};

export default Logo;
