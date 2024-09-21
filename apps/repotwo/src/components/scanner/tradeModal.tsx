import React from "react";
import {
  Box,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  Flex,
  Text,
  Divider,
  Button,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import {
  strategyConfigs,
  type Strategy,
  strategyNames,
} from "@data/strategies.data";
import { calculateProfitEstimates } from "@utils/calculateProfitEstimates/calculateProfitEstimates";
import { scannerOptionToCalculatorOption } from "@utils/transformOptions";
import { Position, type Stock, type TradeSetup } from "optionscout-database";
import { trpc } from "@utils/trpc";
import { map } from "lodash";
import OptionCharts from "@molecules/OptionCharts/OptionCharts";

const TradeModal: React.FC<Props> = ({ trade, strategy, onClose }) => {
  const { data: options } = trpc.scanner.options.useQuery({
    optionIds: trade.optionIds,
  });
  const toast = useToast();
  const strategyConfig = strategyConfigs[strategy];
  const modalBackground = useColorModeValue("background.50", "cards.800");

  const [daysToProfitCalculation, setDaysToProfitCalculation] = React.useState(
    trade.daysToExpiration ?? 0
  );

  const handleCopyClick = () => {
    navigator.clipboard.writeText(trade.name);
    toast({
      status: "success",
      description: "copied to clipboard",
      duration: 1500,
      isClosable: true,
      position: "top-right",
    });
  };

  const calculatorOptions = map(options, (contract, index) =>
    scannerOptionToCalculatorOption(
      contract,
      strategyConfig.legs[index].position,
      strategyConfig.legs[index].multiplier
    )
  );

  const equity = {
    position: strategyConfig.equity ?? Position.Long,
    shares: strategyConfig.equity ? 100 : 0,
  };

  const profitEstimates =
    calculatorOptions.length > 0
      ? calculateProfitEstimates({
          contracts: calculatorOptions,
          currentStockPrice: trade.stock.price,
          dividend: trade.stock.dividendYield ?? 0,
          daysToProfitCalculation,
          equity,
          calculateCollateral: strategyConfig.calculateCollateral,
        })
      : null;

  const breakEvens = profitEstimates?.breakEvens?.value ?? [];

  return (
    <Modal isOpen={trade !== null} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth="1000px" bg={modalBackground}>
        <ModalHeader>{strategyNames[strategy]}</ModalHeader>
        <Box p={4}>
          <Flex my={4} alignItems="center" wrap="wrap">
            <Text fontSize="3xl">{trade?.symbol}</Text>
            <Divider
              mx={2}
              orientation="vertical"
              borderColor="primary.500"
              borderWidth="2px"
              height={10}
            />
            <Text as="b">{trade.name}</Text>
          </Flex>
          {calculatorOptions.length > 0 && breakEvens ? (
            <OptionCharts
              daysToProfitCalculation={daysToProfitCalculation}
              setDaysToProfitCalculation={setDaysToProfitCalculation}
              breakEvens={breakEvens}
              calculatorOptions={calculatorOptions}
              stockData={{
                symbol: trade.symbol,
                price: trade.stock.price,
                divYield: trade.stock.dividendYield ?? 0,
              }}
              equity={equity}
            />
          ) : (
            <Skeleton h={100} />
          )}
          <ModalCloseButton data-testid="close-modal-button" />
          <Flex mt={10} align="center" gap={3}>
            <Text>
              {trade.symbol} {trade.name}
            </Text>
            <Button
              bg="button.orange.700"
              color="background.50"
              rightIcon={<CopyIcon />}
              onClick={handleCopyClick}
            >
              Copy
            </Button>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
};

type Props = {
  trade: ModalTrade;
  onClose: () => void;
  strategy: Strategy;
};

export type ModalTrade = TradeSetup & { stock: Stock };

export default TradeModal;
