import React from "react";
import { type OptionChain } from "@utils/tdApiTypes";
import { groupBy, map, mapValues, uniq } from "lodash";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useCalculatorStore } from "src/state";
import { strategyConfigs } from "@data/strategies.data";
import { SmallCloseIcon } from "@chakra-ui/icons";

const DateSelector: React.FC<{ optionData?: OptionChain }> = ({
  optionData,
}) => {
  const strategy = useCalculatorStore((state) => state.strategy);
  const strategyConfig = strategyConfigs[strategy];
  const expirationDateKeys = useCalculatorStore(
    (state) => state.expirationDateKeys
  );
  const setExpirationDateKeys = useCalculatorStore(
    (state) => state.setExpirationDateKeys
  );
  const resetContracts = useCalculatorStore((state) => state.resetContracts);

  if (!optionData)
    return <Text>Select a stock to view possible expiration dates</Text>;

  const isCalendarSpread = strategyConfig.calendar;

  const { callExpDateMap, putExpDateMap } = optionData;

  const dateKeys = uniq(
    [...Object.keys(callExpDateMap), ...Object.keys(putExpDateMap)].sort()
  );

  const dates = dateKeys.map((dateKey) => ({
    optionChainKey: dateKey,
    formattedDate: new Date(dateKey.split(":")[0]),
  }));
  const datesByYear = groupBy(dates, (date) =>
    date.formattedDate.getFullYear()
  );
  const datesByYearAndMonth = mapValues(datesByYear, (datesInYear) =>
    groupBy(datesInYear, (date) => date.formattedDate.getMonth())
  );

  function formatExpirationDateKeys() {
    if (!expirationDateKeys) {
      return "";
    }
    if (!expirationDateKeys.second) {
      const hint = isCalendarSpread ? "/ Select a second one" : "";
      return (
        ": " +
        format(
          new Date(expirationDateKeys.first.split(":")[0]),
          "MMM d, yyyy"
        ) +
        hint
      );
    }
    return (
      ": " +
      format(new Date(expirationDateKeys.first.split(":")[0]), "MMM d, yyyy") +
      " / " +
      format(new Date(expirationDateKeys.second.split(":")[0]), "MMM d, yyyy")
    );
  }

  function handleSelect(expirationDateKey: string) {
    if (!isCalendarSpread || !expirationDateKeys) {
      setExpirationDateKeys({ first: expirationDateKey });
    } else {
      const selectedDateKeys = [expirationDateKeys.first, expirationDateKey];
      selectedDateKeys.sort();
      setExpirationDateKeys({
        first: selectedDateKeys[0],
        second: selectedDateKeys[1],
      });
    }
    resetContracts();
  }

  return (
    <Box>
      <Heading as="h2" fontSize={"lg"}>
        Expiration Date
        {formatExpirationDateKeys()}
        {expirationDateKeys && (
          <IconButton
            h="7"
            w="7"
            ml="3"
            onClick={() => setExpirationDateKeys(null)}
            variant="outline"
            icon={<SmallCloseIcon />}
            aria-label="Clear Expiration Dates"
          />
        )}
      </Heading>
      <HStack gap="2" divider={<StackDivider />} overflow="scroll" maxW="100%">
        {map(datesByYearAndMonth, (datesByYear, year) => (
          <Stack key={year}>
            <Text>{year}</Text>
            <HStack divider={<StackDivider />}>
              {map(datesByYear, (datesByMonth, idx) => (
                <Stack key={idx}>
                  <Text>{format(datesByMonth[0].formattedDate, "MMM")}</Text>
                  <HStack>
                    {map(datesByMonth, (date) => (
                      <Button
                        key={date.optionChainKey}
                        w="3"
                        variant="outline"
                        color="button.orange.700"
                        onClick={() => handleSelect(date.optionChainKey)}
                        isActive={
                          expirationDateKeys?.first === date.optionChainKey ||
                          expirationDateKeys?.second === date.optionChainKey
                        }
                      >
                        {date.formattedDate.getDate()}
                      </Button>
                    ))}
                  </HStack>
                </Stack>
              ))}
            </HStack>
          </Stack>
        ))}
      </HStack>
    </Box>
  );
};

export default DateSelector;
