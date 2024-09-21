import React from "react";
import { Tr, Td, Text, useColorModeValue } from "@chakra-ui/react";

import { type OptionsContract } from "@utils/tdApiTypes";

const TableRow: React.FC<{
  contract: OptionsContract;
  onSelect: (contract: OptionsContract) => void;
}> = ({ contract, onSelect }) => {
  const bgInTheMoney = useColorModeValue("cards.300", "background.950");
  const bgOutTheMoney = useColorModeValue("background.50", "cards.800");
  const bgHover = useColorModeValue("grey.200", "grey.400");
  const bgColor = contract.inTheMoney ? bgInTheMoney : bgOutTheMoney;

  return (
    <Tr
      bg={bgColor}
      _hover={{
        background: bgHover,
      }}
      cursor="pointer"
      onClick={() => onSelect(contract)}
    >
      <Td color="button.orange.700" textAlign="center">
        <Text as="u">{`${contract.strikePrice} ${contract.putCall}`}</Text>
      </Td>
      <Td textAlign="center">{contract.last.toFixed(2)}</Td>
      <Td textAlign="center" opacity={0.5}>
        {contract.bid.toFixed(2)}
      </Td>
      <Td textAlign="center" opacity={0.5}>
        {contract.ask.toFixed(2)}
      </Td>
      <Td
        textAlign="center"
        textColor={
          contract.percentChange > 0
            ? "success.500"
            : contract.percentChange < 0
            ? "red"
            : "gray"
        }
        opacity={0.5}
      >{`${contract.percentChange.toFixed()}%`}</Td>
    </Tr>
  );
};

export default TableRow;
