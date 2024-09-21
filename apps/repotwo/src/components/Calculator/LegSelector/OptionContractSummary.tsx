import React from "react";
import { Box, Flex, HStack, Stack, StackDivider, Text } from "@chakra-ui/react";
import Image from "next/image";
import { type CalculatorOption } from "@utils/calculateProfitEstimates/calculateProfitEstimates";

const OptionContractSummary: React.FC<{ contract: CalculatorOption }> = ({
  contract,
}) => {
  if (contract.strikePrice === 0) return null;

  return (
    <Stack>
      <HStack gap="1" divider={<StackDivider />}>
        <Box>
          <Text textStyle="heading3">{`$${contract.strikePrice.toFixed(
            2
          )}`}</Text>
          <Text textStyle="small">Strike</Text>
        </Box>
        <Box>
          <Text textStyle="heading3">{`$${contract.optionPrice.toFixed(
            2
          )}`}</Text>
          <Text textStyle="small">Price</Text>
        </Box>
        <Box>
          <Text textStyle="heading3">
            {isNaN(contract.volatility)
              ? "N/A"
              : contract.volatility.toFixed(1)}
          </Text>
          <Text textStyle="small">IV</Text>
        </Box>
      </HStack>
      <Text>Expires in {contract.daysToExpiration} days.</Text>
      <Flex gap="2">
        {[
          { name: "Delta", value: contract.delta },
          { name: "Gamma", value: contract.gamma },
          { name: "Theta", value: contract.theta },
        ].map(
          (greek) =>
            greek.value !== undefined && (
              <Flex key={greek.name} gap="1">
                <Image
                  src={`/Icons/${greek.name}.svg`}
                  alt={greek.name}
                  width="20"
                  height="20"
                />
                <Text>{greek.value.toFixed(2)}</Text>
              </Flex>
            )
        )}
      </Flex>
    </Stack>
  );
};

export default OptionContractSummary;
