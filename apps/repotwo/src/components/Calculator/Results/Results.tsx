import { Card, CardBody, useColorModeValue, Text } from "@chakra-ui/react";
import { strategyConfigs } from "@data/strategies.data";
import OptionCharts from "@molecules/OptionCharts/OptionCharts";
import ProfitEstimates from "src/components/Calculator/Results/ProfitEstimates/ProfitEstimates";
import { calculateProfitEstimates } from "@utils/calculateProfitEstimates/calculateProfitEstimates";
import { filter, map } from "lodash";
import React, { useEffect } from "react";
import { useCalculatorStore } from "src/state";
import SaveTrade from "./SaveTrade";
import { featureFlags } from "@utils/featureFlags";

const Results: React.FC<{ stockData?: ChartStockData }> = ({ stockData }) => {
  const background = useColorModeValue("background.50", "cards.800");
  const contracts = useCalculatorStore((state) => state.contracts);
  const equity = useCalculatorStore((state) => state.equity);
  const strategy = useCalculatorStore((state) => state.strategy);
  const strategyConfig = strategyConfigs[strategy];

  const calculatorOptions = filter(
    contracts,
    (contract) => contract.strikePrice > 0
  );

  const [daysToProfitCalculation, setDaysToProfitCalculation] =
    React.useState(0);

  useEffect(() => {
    const minDaysToExpiration = Math.min(
      ...map(contracts, (contract) => contract.daysToExpiration)
    );
    setDaysToProfitCalculation(minDaysToExpiration);
  }, [contracts]);

  if (!stockData || calculatorOptions.length === 0) {
    return (
      <Card maxW="xl" bg={background}>
        <CardBody>
          <Text>Select option contracts to view profit estimates.</Text>
        </CardBody>
      </Card>
    );
  }

  const profitEstimates =
    calculatorOptions.length > 0
      ? calculateProfitEstimates({
          contracts: calculatorOptions,
          currentStockPrice: stockData.price,
          dividend: stockData.divYield / 100,
          daysToProfitCalculation,
          equity,
          calculateCollateral: strategyConfig.calculateCollateral,
        })
      : null;

  const breakEvens = profitEstimates?.breakEvens?.value ?? [];

  return (
    <>
      {profitEstimates && <ProfitEstimates profitEstimates={profitEstimates} />}
      <OptionCharts
        stockData={stockData}
        daysToProfitCalculation={daysToProfitCalculation}
        setDaysToProfitCalculation={setDaysToProfitCalculation}
        breakEvens={breakEvens}
        calculatorOptions={calculatorOptions}
        equity={equity}
      />
      {!featureFlags.hideScanner && profitEstimates && (
        <SaveTrade stockData={stockData} profitEstimates={profitEstimates} />
      )}
    </>
  );
};

export type ChartStockData = {
  symbol: string;
  price: number;
  divYield: number;
};

export default Results;
