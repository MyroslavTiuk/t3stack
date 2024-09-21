import { OptionType, Position } from "optionscout-database";
import { blackScholes } from "./blackScholes";
import { type CalculatorOption, type Equity } from "./calculateProfitEstimates";

type Strategy = {
  contracts: CalculatorOption[];
  equity: Equity;
  currentStockPrice: number;
  dividend: number;
  expirationStockPrice: number;
  daysToProfitCalculation: number;
};

export function calculateProfit({
  contracts,
  equity,
  currentStockPrice,
  expirationStockPrice,
  dividend,
  daysToProfitCalculation,
}: Strategy) {
  const optionsProfit = contracts.reduce(
    (profit, contract) =>
      profit +
      calculateOptionProfit(
        contract,
        expirationStockPrice,
        daysToProfitCalculation,
        dividend
      ),
    0
  );

  const stockProfit = calculateStockProfit(
    equity,
    expirationStockPrice,
    currentStockPrice
  );

  return optionsProfit + stockProfit;
}

function calculateOptionProfit(
  contract: CalculatorOption,
  expirationStockPrice: number,
  daysToProfitCalculation: number,
  dividend: number
) {
  const value = calculateOptionValue(
    contract,
    expirationStockPrice,
    daysToProfitCalculation,
    dividend
  );
  const profit = (value - contract.optionPrice) * 100 * contract.contractsCount;
  return contract.position === Position.Long ? profit : -profit;
}

function calculateOptionValue(
  contract: CalculatorOption,
  expirationStockPrice: number,
  daysToProfitCalculation: number,
  dividend: number
) {
  if (
    contract.optionType === OptionType.Call &&
    contract.daysToExpiration.toFixed() === daysToProfitCalculation.toFixed()
  ) {
    return calculateExpiredCallValue(contract, expirationStockPrice);
  } else if (
    contract.optionType === OptionType.Put &&
    contract.daysToExpiration.toFixed() === daysToProfitCalculation.toFixed()
  ) {
    return calculateExpiredPutValue(contract, expirationStockPrice);
  } else {
    return estimateOpenOptionValue(
      contract,
      expirationStockPrice,
      daysToProfitCalculation,
      dividend
    );
  }
}

function calculateExpiredCallValue(
  contract: CalculatorOption,
  expirationStockPrice: number
) {
  const isOptionAssigned = expirationStockPrice > contract.strikePrice;
  return isOptionAssigned ? expirationStockPrice - contract.strikePrice : 0;
}

function calculateExpiredPutValue(
  contract: CalculatorOption,
  expirationStockPrice: number
) {
  const isOptionAssigned = expirationStockPrice < contract.strikePrice;
  return isOptionAssigned ? contract.strikePrice - expirationStockPrice : 0;
}

function estimateOpenOptionValue(
  contract: CalculatorOption,
  stockPrice: number,
  daysToProfitCalculation: number,
  dividend: number
) {
  const { strikePrice, volatility, optionType } = contract;
  const timeToExpiration =
    (contract.daysToExpiration - daysToProfitCalculation) / 365;
  return blackScholes({
    stockPrice,
    strikePrice,
    volatility: volatility / 100,
    timeToExpiration,
    optionType,
    dividend,
  });
}

function calculateStockProfit(
  equity: Equity,
  expirationStockPrice: number,
  currentStockPrice: number
) {
  if (equity.position === Position.Long) {
    return (expirationStockPrice - currentStockPrice) * equity.shares;
  }
  if (equity.position === Position.Short) {
    return (currentStockPrice - expirationStockPrice) * equity.shares;
  }
  return 0;
}
