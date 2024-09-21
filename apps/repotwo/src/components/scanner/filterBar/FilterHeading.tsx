import React from "react";
import { Flex, Divider, Text, Heading } from "@chakra-ui/react";

import { type Strategy, strategyNames } from "@data/strategies.data";
import { thousandSeparator } from "@utils/thousandSeparator";

export const FilterHeading: React.FC<Props> = ({ tradeCount, strategy }) => (
  <Flex w="full" alignItems="end" gap="2" mt="auto" wrap="wrap">
    {tradeCount ? (
      <>
        <Heading>{thousandSeparator(tradeCount)} Trades Found</Heading>
        <Divider
          orientation="vertical"
          bgColor="primary.500"
          w="1"
          h="10"
          opacity="1"
        />
        <Text>Based on current filters</Text>
      </>
    ) : (
      <Heading mt={3} as="h1">
        {strategyNames[strategy]} Scanner
      </Heading>
    )}
  </Flex>
);

type Props = {
  tradeCount?: number;
  strategy: Strategy;
};
