import React from "react";
import { Button, Icon, Stack, Text } from "@chakra-ui/react";
import { BiSave } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import { useCalculatorStore } from "src/state";
import { add, format } from "date-fns";
import { type ChartStockData } from "./Results";
import { type ProfitEstimates } from "@utils/calculateProfitEstimates/calculateProfitEstimates";
import { strategyNames } from "@data/strategies.data";

const SaveTrade: React.FC<Props> = ({ stockData, profitEstimates }) => {
  const { status } = useSession();
  const strategy = useCalculatorStore((state) => state.strategy);
  const strategyName = strategyNames[strategy];
  const contracts = useCalculatorStore((state) => state.contracts);
  const equity = useCalculatorStore((state) => state.equity);

  const { mutate, isLoading, isSuccess, isError } =
    trpc.saveTrades.saveTrade.useMutation();

  function handleSave() {
    mutate({
      symbol: stockData.symbol,
      name: `${stockData.symbol} ${strategyName} ${format(
        new Date(),
        "MM/dd/yyyy"
      )}`,
      pop: profitEstimates.probabilityOfProfit?.value,
      netCredit: profitEstimates.netCredit?.value,
      options: contracts.map((contract) => ({
        optionType: contract.optionType,
        position: contract.position,
        contractsCount: contract.contractsCount,
        strikePrice: contract.strikePrice,
        optionPrice: contract.optionPrice,
        stockPrice: stockData.price,
        tradeDate: new Date(),
        expiration: add(new Date(), { days: contract.daysToExpiration }),
        iv: contract.volatility,
      })),
      equity,
    });
  }

  function getMessage() {
    if (isSuccess) {
      return "Trade saved!";
    }

    if (isError) {
      return "Error saving trade";
    }

    return "";
  }

  return (
    <Stack>
      <Button
        leftIcon={<Icon as={BiSave} />}
        maxW="2xs"
        color="background.50"
        bg="button.orange.700"
        isDisabled={status !== "authenticated"}
        isActive={status !== "authenticated"}
        onClick={handleSave}
        isLoading={isLoading}
      >
        {status === "unauthenticated" ? "Log in to Save Trade" : "Save Trade"}
      </Button>
      <Text>{getMessage()}</Text>
    </Stack>
  );
};

type Props = {
  stockData: ChartStockData;
  profitEstimates: ProfitEstimates;
};

export default SaveTrade;
