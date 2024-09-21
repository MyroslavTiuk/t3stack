import React from "react";
import {
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue,
  useNumberInput,
} from "@chakra-ui/react";
import { useCalculatorStore } from "src/state";

const CardTitle: React.FC<{ legIndex: number }> = ({ legIndex }) => {
  const highlightColor = useColorModeValue("primary.200", "primary.500");
  const contracts = useCalculatorStore((state) => state.contracts);
  const contract = contracts[legIndex];

  const setContractsCount = useCalculatorStore(
    (state) => state.setContractsCount
  );

  function getTitle() {
    const multiplierText =
      contract.contractsCount > 1 ? ` (x${contract.contractsCount})` : "";

    return `${contract.position} ${contract.optionType}${multiplierText}`;
  }

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      value: contract.contractsCount,
      min: 1,
      onChange: (value) => {
        setContractsCount(Number(value), legIndex);
      },
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text textStyle="caption2" color={highlightColor}>
        {getTitle()}
      </Text>
      <Flex>
        <Button borderRadius="2px" size="xs" {...dec}>
          -
        </Button>
        <Input size="xs" {...input} w="40px" textAlign="center" />
        <Button borderRadius="2px" size="xs" {...inc}>
          +
        </Button>
      </Flex>
    </Flex>
  );
};

export default CardTitle;
