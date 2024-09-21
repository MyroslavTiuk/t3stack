import React from "react";
import {
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCalculatorStore } from "src/state";
import { trpc } from "@utils/trpc";
import { map } from "lodash";
import TableRow from "./TableRow";
import { type OptionsContract } from "@utils/tdApiTypes";
import { OptionType } from "optionscout-database";

const OptionChainComponent: React.FC<{
  optionType: OptionType;
  expirationDateKey?: string;
  onSelect: (contract: OptionsContract) => void;
}> = ({ optionType, expirationDateKey, onSelect }) => {
  const color = useColorModeValue("card.800", "neutral.500");
  const stockSymbol = useCalculatorStore((state) => state.stockSymbol);

  const { data: optionChain } = trpc.tdApi.options.useQuery(
    { symbol: stockSymbol ?? "" },
    { enabled: !!stockSymbol }
  );

  if (!optionChain) {
    return <Text>Select a stock symbol to view available options.</Text>;
  }

  if (!expirationDateKey) {
    return <Text>Select an expiration date to view available options.</Text>;
  }

  const { callExpDateMap, putExpDateMap } = optionChain;
  const columnNames = ["Strike", "Last", "Bid", "Ask", "Change"];

  const expDateMap =
    optionType === OptionType.Call ? callExpDateMap : putExpDateMap;

  return (
    <Table size="xs" color={color} sx={{ whiteSpace: "normal" }}>
      <Thead>
        <Tr py={2}>
          {columnNames.map((name, idx) => {
            return (
              <Th key={`${name}${idx}`} textAlign="center">
                {name}
              </Th>
            );
          })}
        </Tr>
      </Thead>
      <Tbody>
        {map(expDateMap[expirationDateKey], (contracts) => {
          const contract = contracts[0];
          return (
            <TableRow
              key={contract.strikePrice}
              contract={contract}
              onSelect={onSelect}
            />
          );
        })}
      </Tbody>
    </Table>
  );
};

export default OptionChainComponent;
