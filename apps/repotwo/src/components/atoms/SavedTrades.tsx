import React from "react";
import { trpc } from "@utils/trpc";
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const SavedTrades: React.FC = () => {
  const { data, isLoading, isError } = trpc.saveTrades.getTrades.useQuery();
  const cardBg = useColorModeValue("background.50", "cards.800");

  if (isError) {
    return <Text>Error loading trades. Try refreshing the page.</Text>;
  }
  if (isLoading) {
    return <Skeleton height="5" />;
  }

  return (
    <Stack gap="2">
      {data?.map((trade) => (
        <Card bg={cardBg} key={trade.id}>
          <CardHeader pb="0">
            <Heading size="md">{trade.name}</Heading>{" "}
            <Text>
              {trade.pop &&
                `${(trade.pop * 100).toFixed()}% chance of profit, `}
              {trade.netCredit &&
                `$${Math.abs(trade.netCredit).toFixed(2)} ${
                  trade.netCredit > 0 ? "Net credit" : "Net debit"
                }`}
            </Text>
          </CardHeader>
          <CardBody>
            {trade.options.length > 0 && <Heading size="sm">Options</Heading>}
            {trade.options.map((option) => (
              <Text pl="3" key={option.id}>
                {option.position} {option.optionType}
                {", "}${option.stockPrice.toFixed(2)} stock price{", "}$
                {option.strikePrice.toFixed(2)} strike{", "}$
                {option.optionPrice.toFixed(2)}
              </Text>
            ))}
            {trade.equity && trade.equity.shares > 0 && (
              <>
                <Heading size="sm" mt="3">
                  Equity
                </Heading>
                <Text pl="3">
                  {trade.equity.position} {trade.equity.shares} shares
                </Text>
              </>
            )}
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
};

export default SavedTrades;
