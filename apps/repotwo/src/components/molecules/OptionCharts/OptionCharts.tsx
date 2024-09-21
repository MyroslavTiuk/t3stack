import React, { useState } from "react";
import TradingView from "@molecules/OptionCharts/TradingView/TradingView";
import WinLossChart from "@molecules/OptionCharts/WinLossChart/WinLossChart";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { type ChartStockData } from "src/components/Calculator/Results/Results";
import {
  type CalculatorOption,
  type Equity,
} from "@utils/calculateProfitEstimates/calculateProfitEstimates";

type Props = {
  daysToProfitCalculation: number;
  setDaysToProfitCalculation: React.Dispatch<React.SetStateAction<number>>;
  breakEvens: number[];
  calculatorOptions: CalculatorOption[];
  stockData: ChartStockData;
  equity: Equity;
};

const OptionCharts: React.FC<Props> = ({
  stockData,
  daysToProfitCalculation,
  setDaysToProfitCalculation,
  breakEvens,
  calculatorOptions,
  equity,
}) => {
  const background = useColorModeValue("background.50", "cards.800");
  const [activeChart, setActiveChart] = useState<"TradingView" | "WinLoss">(
    "WinLoss"
  );

  return (
    <Card bg={background}>
      <CardBody>
        <Flex w="100%" justifyContent="end" mb="3">
          <ButtonGroup isAttached>
            <Button
              variant="outline"
              bg={activeChart === "TradingView" ? "orange.600" : undefined}
              border="1px"
              borderColor="orange.600"
              onClick={() => setActiveChart("TradingView")}
            >
              Stock Data
            </Button>
            <Button
              variant="outline"
              bg={activeChart === "WinLoss" ? "orange.600" : undefined}
              border="1px"
              borderColor="orange.600"
              onClick={() => setActiveChart("WinLoss")}
            >
              Graph
            </Button>
          </ButtonGroup>
        </Flex>
        {activeChart === "TradingView" && (
          <TradingView symbol={stockData.symbol} />
        )}
        {activeChart === "WinLoss" && (
          <WinLossChart
            stockData={stockData}
            daysToProfitCalculation={daysToProfitCalculation}
            setDaysToProfitCalculation={setDaysToProfitCalculation}
            breakEvens={breakEvens}
            calculatorOptions={calculatorOptions}
            equity={equity}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default OptionCharts;
