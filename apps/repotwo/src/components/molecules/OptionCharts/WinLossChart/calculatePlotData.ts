import { calculateProfit } from "@utils/calculateProfitEstimates/calculateProfit";
import {
  type CalculatorOption,
  type Equity,
} from "@utils/calculateProfitEstimates/calculateProfitEstimates";
import { addDays, format } from "date-fns";
import { range, sortBy } from "lodash";

export type CalculatePlotDataInput = {
  currentStockPrice: number;
  calculatorOptions: CalculatorOption[];
  equity: Equity;
  daysToProfitCalculation: number;
  dividend: number;
  xAxisPercent: number;
  breakEvens: number[];
};

export function calculatePlotData({
  currentStockPrice,
  calculatorOptions,
  equity,
  daysToProfitCalculation,
  dividend,
  xAxisPercent,
  breakEvens,
}: CalculatePlotDataInput) {
  if (calculatorOptions.length === 0) {
    return { data: [], labels: { x: "", y: "" }, gradientOffset: 0 };
  }

  const strikePrices = calculatorOptions.map(
    (contract) => contract.strikePrice
  );
  const prices = [currentStockPrice, ...strikePrices, ...breakEvens];

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const xMin = Math.ceil(minPrice * ((100 - xAxisPercent) / 100));
  const xMax = Math.ceil(maxPrice * ((100 + xAxisPercent) / 100));

  const interval = (xMax - xMin) / 100;
  const chartRange = range(xMin, xMax, interval);

  // Bug in recharts renders the first and last ticks as decimals if they are not integers
  // see https://github.com/recharts/recharts/issues/777
  chartRange[0] = Math.floor(xMin);
  chartRange[chartRange.length - 1] = Math.ceil(xMax);

  const plotData = chartRange.map((expirationStockPrice) => ({
    x: expirationStockPrice,
    y: calculateProfit({
      contracts: calculatorOptions,
      equity,
      currentStockPrice,
      expirationStockPrice,
      daysToProfitCalculation,
      dividend,
    }),
  }));

  const calculationDate = format(
    addDays(new Date(), daysToProfitCalculation),
    "MMM/dd/yyyy"
  );

  const labels = {
    x: `Stock Price on ${calculationDate}`,
    y: `Profit/Loss on ${calculationDate}`,
  };

  const gradientOffset = (() => {
    const maxY = Math.max(...plotData.map((i) => i.y));
    const minY = Math.min(...plotData.map((i) => i.y));
    if (maxY <= 0) {
      return 0;
    }
    if (minY >= 0) {
      return 1;
    }

    return maxY / (maxY - minY);
  })();

  const referencePrices = sortBy(
    [
      {
        price: currentStockPrice,
        label: `Current Stock Price $${currentStockPrice}`,
      },
      ...calculatorOptions.map((contract) => ({
        price: contract.strikePrice,
        label: `${contract.optionType} Strike $${contract.strikePrice}`,
      })),
      ...breakEvens.map((price) => ({
        price,
        label: `Break Even $${price.toFixed(2)}`,
      })),
    ],
    "price"
  );

  return { data: plotData, labels, gradientOffset, referencePrices };
}

export type PlotDataResult = ReturnType<typeof calculatePlotData>;
