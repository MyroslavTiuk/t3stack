import React from "react";
import { createStandaloneToast, Flex, Heading, Stack } from "@chakra-ui/react";
import { Preloader } from "@atoms/Preloader";
import Header from "./Header";
import Description from "./Description";
import StockSymbol from "./StockSymbol";
import { useCalculatorStore } from "src/state";
import { trpc } from "@utils/trpc";
import LegSelector from "./LegSelector/LegSelector";
import DateSelector from "./DateSelector";
import Results from "./Results/Results";

const { toast } = createStandaloneToast();

const Calculator: React.FC = () => {
  const stockSymbol = useCalculatorStore((state) => state.stockSymbol);

  const stock = trpc.tdApi.stock.useQuery(
    { symbol: stockSymbol ?? "" },
    { enabled: !!stockSymbol }
  );

  const options = trpc.tdApi.options.useQuery(
    { symbol: stockSymbol ?? "" },
    { enabled: !!stockSymbol }
  );

  if (options.isError || stock.isError) {
    toast({
      title: "An error occurred.",
      description: "Please try refreshing the page.",
      status: "error",
      duration: 9000,
      isClosable: true,
      position: "top-right",
    });
  }

  return (
    <Preloader
      isLoading={!!stockSymbol && (options.isLoading || stock.isLoading)}
    >
      <Flex justify="center">
        <Stack
          px={{ base: 3, sm: 8 }}
          py={8}
          gap={5}
          w={{ base: "100%", xl: "container.xl" }}
        >
          <Header />
          <Description />
          <StockSymbol />
          <DateSelector optionData={options.data} />
          <Flex width={"100%"} gap="5" wrap="wrap">
            <Stack maxW={{ base: "100%", lg: "28%" }} gap="3">
              <Heading as="h2" fontSize={"lg"}>
                Option Contracts
              </Heading>
              <LegSelector />
            </Stack>
            <Stack w={{ base: "100%", lg: "68%" }} gap="3">
              <Heading as="h2" fontSize={"lg"}>
                Estimated Returns
              </Heading>
              <Results
                stockData={
                  stock.data
                    ? {
                        symbol: stock.data.symbol,
                        price: stock.data.mark,
                        divYield: stock.data.divYield,
                      }
                    : undefined
                }
              />
            </Stack>
          </Flex>
        </Stack>
      </Flex>
    </Preloader>
  );
};

export default Calculator;
