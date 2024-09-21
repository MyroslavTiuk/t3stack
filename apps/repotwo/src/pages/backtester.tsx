import React from "react";
import { Box, Heading, Stack } from "@chakra-ui/react";
import { trpc } from "@utils/trpc";
import Selectors from "src/components/backtester/Selectors";
import { type NumericFilterInput } from "src/server/router/scanner";
import TradeCard from "src/components/backtester/TradeCard/TradeCard";

const Backtester: React.FC = () => {
  const [delta, setDelta] = React.useState<NumericFilterInput>({
    gte: 0,
    lte: 1,
  });
  const [daysToExpiration, setDaysToExpiration] =
    React.useState<NumericFilterInput>({
      gte: 0,
      lte: 100,
    });

  const { data } = trpc.backtester.tradeHistory.useQuery({
    delta,
    daysToExpiration,
  });

  return (
    <Box px={{ sm: 1, md: 10 }}>
      <Heading>Backtester for TSLA covered calls</Heading>
      <Selectors
        delta={delta}
        setDelta={setDelta}
        daysToExpiration={daysToExpiration}
        setDaysToExpiration={setDaysToExpiration}
      />

      <Heading as="h2" size="md" my="5">
        Covered Call Trades
      </Heading>
      {data && (
        <Stack gap="4">
          {data.map((option, idx) => (
            <TradeCard option={option} key={idx} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Backtester;
