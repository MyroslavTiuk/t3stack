import React from "react";
import {
  Flex,
  Button,
  Text,
  Box,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";
import {
  scannerStrategies,
  type Strategy,
  strategyNames,
} from "@data/strategies.data";
import { DEFAULT_SCANNER_STRATEGY } from "src/pages/scanner";

const TableHeader: React.FC<Props> = ({
  onOpenDrawer,
  strategy,
  setStrategy,
  isScanEnabled,
}) => {
  const filterBarBackground = useColorModeValue("cards.50", "cards.800");

  const handleStrategyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStrategy(event.target.selectedOptions[0].value as Strategy);
  };

  const strategyOptions = scannerStrategies.map((strategy) => ({
    value: strategy,
    title: strategyNames[strategy],
  }));

  return (
    <Flex
      borderTopRadius="md"
      wrap="wrap"
      bg={filterBarBackground}
      py="2"
      px="3"
      gap="2"
      alignItems="center"
      width="full"
    >
      {isScanEnabled && <Text as="h1">{strategyNames[strategy]} Scan</Text>}
      <Flex gap="2" align="center" ml={{ md: "auto" }}>
        <Text>Strategy</Text>
        <Select
          onChange={handleStrategyChange}
          maxW="300px"
          data-testid="scanner-select"
          defaultValue={DEFAULT_SCANNER_STRATEGY}
        >
          {strategyOptions.map((strategy) => (
            <option key={strategy.value} value={strategy.value}>
              {strategy.title}
            </option>
          ))}
        </Select>
      </Flex>
      <Box bg={filterBarBackground}>
        <Button
          bg="button.orange.700"
          color="background.50"
          onClick={onOpenDrawer}
        >
          SCAN OPTIONS
        </Button>
      </Box>
    </Flex>
  );
};

type Props = {
  isScanEnabled: boolean;
  onOpenDrawer: () => void;
  strategy: Strategy;
  setStrategy: React.Dispatch<React.SetStateAction<Strategy>>;
};

export default TableHeader;
