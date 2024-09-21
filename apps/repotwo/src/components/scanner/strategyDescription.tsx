import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

const StrategyDescription: React.FC<Props> = ({ description }) => {
  const bgColor = useColorModeValue("background.200", "cards.800");
  return (
    <Box px={1} py={5} bg={bgColor} borderBottomRadius="md" w="full">
      <Text maxW="prose">{description}</Text>
    </Box>
  );
};

type Props = {
  description: string;
};

export default StrategyDescription;
