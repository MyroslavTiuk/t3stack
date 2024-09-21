import { Flex, Text, Box, Stack } from "@chakra-ui/react";
import { useCalculatorStore } from "src/state";
import { find, map, uniq } from "lodash";
import { addDays, format } from "date-fns";
import { type ProfitEstimates as ProfitEstimatesType } from "@utils/calculateProfitEstimates/calculateProfitEstimates";
import ProfitEstimateCard from "./ProfitEstimateCard";
import { calculateAvgGreeks } from "./calculateAvgGreeks";
import { OptionType } from "optionscout-database";

type Props = {
  profitEstimates: ProfitEstimatesType;
};

const ProfitEstimates = ({ profitEstimates }: Props) => {
  const tradeName = useCreateTradeName(profitEstimates.netCredit.value ?? 0);
  const contracts = useCalculatorStore((state) => state.contracts);
  const avgGreeks = calculateAvgGreeks(contracts);

  return (
    <Box mt={3}>
      <Text as="b">{tradeName}</Text>
      <Stack gap="5">
        <Flex gap="2" wrap="wrap">
          {map(profitEstimates, (profitEstimate) => {
            if (!profitEstimate) {
              return null;
            }
            return (
              <ProfitEstimateCard
                profitEstimate={profitEstimate}
                key={profitEstimate.title}
              />
            );
          })}
        </Flex>
        <Flex gap="2" wrap="wrap">
          {map(avgGreeks, (greek) => (
            <ProfitEstimateCard key={greek.title} profitEstimate={greek} />
          ))}
        </Flex>
      </Stack>
    </Box>
  );
};

function useCreateTradeName(netDebit: number) {
  const stockSymbol = useCalculatorStore((state) => state.stockSymbol);
  const contracts = useCalculatorStore((state) => state.contracts);

  const expirationDates = uniq(
    map(contracts, (contract) =>
      format(addDays(new Date(), contract.daysToExpiration), "MMM d, yyyy")
    )
  ).join("/");

  const strikes = map(contracts, (contract) => contract.strikePrice).join("/");
  const containsCalls = !!find(
    contracts,
    (contract) => contract.optionType === OptionType.Call
  );
  const containsPuts = !!find(
    contracts,
    (contract) => contract.optionType === OptionType.Put
  );
  const tradeOptionType = formatOptionType(containsCalls, containsPuts);
  const formattedNetDebit = `$${Math.abs(netDebit).toFixed(2)}`;

  return `${stockSymbol} ${expirationDates} ${strikes} ${tradeOptionType} ${formattedNetDebit}`;
}

function formatOptionType(containsCalls: boolean, containsPuts: boolean) {
  if (containsCalls && containsPuts) {
    return "CALL/PUT";
  }
  if (containsCalls) {
    return "CALL";
  }
  return "PUT";
}

export default ProfitEstimates;
