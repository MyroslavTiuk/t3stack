import { Box, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { type TooltipProps } from "recharts";

const Tooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  const cardColor = useColorModeValue("cards.50", "cards.800");
  if (active && payload && payload.length) {
    return (
      <Box textStyle="caption2" bg={cardColor} px={2} py={1} borderRadius={4}>
        ${label.toFixed(2)} <br />${payload[0].value?.toFixed(2)}
      </Box>
    );
  }
  return null;
};

export default Tooltip;
