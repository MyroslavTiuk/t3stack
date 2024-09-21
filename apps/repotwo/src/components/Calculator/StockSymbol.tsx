import React from "react";
import { Box, Flex, Text, Divider, useColorModeValue } from "@chakra-ui/react";

import { type AutocompleteOption } from "@atoms/Autocomplete";
import { SymbolAutocomplete } from "@molecules/SymbolAutocomplete";

import { useCalculatorStore } from "src/state";
import { trpc } from "@utils/trpc";

const StockSymbol: React.FC = () => {
  const highlightColor = useColorModeValue("primary.200", "primary.500");
  const stockSymbol = useCalculatorStore((state) => state.stockSymbol);
  const setSymbol = useCalculatorStore((state) => state.setSymbol);
  const reset = useCalculatorStore((state) => state.reset);

  const { data: stock } = trpc.tdApi.stock.useQuery(
    { symbol: stockSymbol ?? "" },
    { enabled: !!stockSymbol }
  );

  const onAutocompleteChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: AutocompleteOption | null
  ) => {
    if (!value?.id) {
      reset();
    } else {
      setSymbol(value.id);
    }
  };

  return (
    <>
      <Flex gap="3" wrap="wrap">
        <Box w="xs">
          <SymbolAutocomplete onChange={onAutocompleteChange} />
        </Box>
        {stockSymbol && stock && (
          <Flex align="center" gap="3">
            <Text fontSize="3xl">{stockSymbol}</Text>
            <Flex
              alignItems="center"
              justifyContent="flexStart"
              height={4}
              mt={2}
            >
              <Text>${stock.mark.toFixed(2)}</Text>
              <Divider
                mx={2}
                orientation="vertical"
                borderColor={highlightColor}
                borderWidth="2px"
                opacity={1}
              />
              <Text>
                ${stock.markChangeInDouble.toFixed(2)}
                <Text
                  as="span"
                  textColor={
                    stock.markPercentChangeInDouble > 0
                      ? "success.500"
                      : stock.markPercentChangeInDouble < 0
                      ? "red"
                      : "gray"
                  }
                >
                  ({stock.markPercentChangeInDouble.toFixed()}%)
                </Text>
              </Text>
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  );
};

export default StockSymbol;
