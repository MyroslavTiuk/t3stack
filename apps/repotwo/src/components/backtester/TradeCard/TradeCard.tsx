import {
  Card,
  CardBody,
  Flex,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React from "react";
import { type OptionWithHistory } from "src/server/router/backtester";
import Plot from "./Plot";

const TradeCard: React.FC<{ option: OptionWithHistory }> = ({ option }) => {
  const cardBg = useColorModeValue("background.50", "cards.800");

  return (
    <Card bg={cardBg}>
      <CardBody>
        <Flex gap="3" mb="3">
          <Text>{format(option.quote_date, "MMM d, yyyy")}</Text>
          <Text>Stock Price ${option.underlying_last}</Text>
          <Text>Strike ${option.strike}</Text>
          <Text>
            {option.dte} days to expiration (
            {format(option.expire_date, "MMM d")})
          </Text>
          <Text>Delta {option.c_delta.toFixed(2)}</Text>
          <Text>Ask Price ${option.c_ask}</Text>
        </Flex>
        <Plot option={option} />
      </CardBody>
    </Card>
  );
};

export default TradeCard;
