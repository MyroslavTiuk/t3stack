import React from "react";
import { useRouter } from "next/router";
import { Flex, Box, Text, Heading, useColorModeValue } from "@chakra-ui/react";
import { otherStrategies, popularStrategies } from "./strategies.data";
import {
  Autocomplete,
  type AutocompleteOption,
} from "../../atoms/Autocomplete/Autocomplete";
import { StrategyCard } from "./StrategyCard";
import { strategyDescriptions } from "@data/strategies.data";
import { featureFlags } from "@utils/featureFlags";

export type StrategyType = {
  description: string;
  href: string;
  srcDark: string;
  srcLight: string;
  strategyName: string;
};

const Strategies = () => {
  const highlightColor = useColorModeValue("primary.200", "primary.500");

  const autocompleteStrategies: StrategyType[] = [
    ...popularStrategies,
    ...otherStrategies,
  ];

  const options = autocompleteStrategies.map((strategy) => ({
    id: strategy.href,
    label: strategy.strategyName,
  }));

  const router = useRouter();

  const onChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: AutocompleteOption | null
  ) => {
    if (value) {
      router.push(value.id);
    }
  };

  return (
    <>
      <Box mx={{ base: 3, sm: 20 }} py={8} textAlign="center">
        <Heading as={"h1"} fontSize="3xl">
          Visualization tools for optimizing options trades
        </Heading>
        <Text fontSize="xl" as="i">
          Built by Traders for Traders
        </Text>
      </Box>
      <Flex direction="column" mx={{ base: 3, sm: 20 }} py={8} gap={7}>
        <Flex justifyContent="center">
          <Box w="xl">
            <Autocomplete
              options={options}
              onChange={onChange}
              label="Choose a Strategy to get Started"
            />
          </Box>
        </Flex>
        <Heading fontSize="xl" color={highlightColor}>
          Popular Option Trading Strategies
        </Heading>
        <Flex gap={4} wrap="wrap">
          {popularStrategies.map((strategy) => (
            <StrategyCard key={strategy.strategyName} strategy={strategy} />
          ))}
        </Flex>
        <Heading fontSize="xl" color={highlightColor}>
          Less talked about strategies
        </Heading>
        <Flex gap={4} wrap="wrap">
          {otherStrategies.map((strategy) => (
            <StrategyCard key={strategy.strategyName} strategy={strategy} />
          ))}
        </Flex>
        <Heading fontSize="xl" color={highlightColor}>
          Build your Own Strategy
        </Heading>
        <StrategyCard
          strategy={{
            strategyName: "Custom",
            description: strategyDescriptions["custom"],
            srcDark: "/pictures/StrategiesDarkMode/LongCall.svg",
            srcLight: "/pictures/StrategiesLightMode/LongCall.svg",
            href: "/option-calculator/custom",
          }}
        />
        {!featureFlags.hideScanner && (
          <>
            <Text maxW="prose" mt="10">
              View estimated returns over time at any theoretical underlying
              price. View results in our original profit matrix, or by risk
              profile line-graph. See the effect of implied volatility using our
              new IV slider.
            </Text>
            <Text maxW="prose">
              Our calculator prices the future value of options using the Black
              Scholes formula, giving you the best chance of knowing your
              anticipated outcome.
            </Text>
            <Text maxW="prose" mb="10">
              Use the calculator that has provided visibility to the options
              trading community since 2008.
            </Text>
          </>
        )}
      </Flex>
    </>
  );
};

export default Strategies;
