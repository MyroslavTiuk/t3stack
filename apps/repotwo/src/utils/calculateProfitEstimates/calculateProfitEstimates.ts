import { type StrategyConfig } from "@data/strategies.data";
import { OptionType, Position } from "optionscout-database";
import { getTimeParameter, profitEstimate } from "./blackScholes";
import { calculateProfit } from "./calculateProfit";

export type CalculatorOption = {
  strikePrice: number;
  optionPrice: number;
  daysToExpiration: number;
  position: Position;
  optionType: OptionType;
  volatility: number;
  contractsCount: number;
  delta?: number;
  gamma?: number;
  theta?: number;
};

export type Equity = {
  position: Position;
  shares: number;
};

type CalculateProfitEstimates = {
  contracts: CalculatorOption[];
  currentStockPrice: number;
  dividend: number;
  daysToProfitCalculation: number;
  equity: Equity;
  calculateCollateral: StrategyConfig["calculateCollateral"];
};

export type ProfitEstimate<Value> = {
  title: string;
  value: Value;
  formattedValue: string;
  icon?: string;
};

export type ProfitEstimates = {
  maxProfit: ProfitEstimate<number>;
  maxLoss: ProfitEstimate<number>;
  breakEvens: ProfitEstimate<number[]>;
  netCredit: ProfitEstimate<number>;
  roi?: ProfitEstimate<number>;
  collateral?: ProfitEstimate<number>;
  probabilityOfProfit?: ProfitEstimate<number>;
};

export function calculateProfitEstimates({
  contracts,
  currentStockPrice,
  dividend,
  daysToProfitCalculation,
  equity,
  calculateCollateral,
}: CalculateProfitEstimates): ProfitEstimates {
  const strikePrices = contracts.map((contract) => contract.strikePrice);

  const calculateProfitAtPrice = (price: number) =>
    calculateProfit({
      contracts,
      equity,
      currentStockPrice,
      dividend,
      expirationStockPrice: price,
      daysToProfitCalculation,
    });

  const minMaxProfit = calculateMinMaxProfit(
    strikePrices,
    calculateProfitAtPrice
  );
  const breakEvens = calculateBreakEvens(
    strikePrices,
    currentStockPrice,
    calculateProfitAtPrice
  );
  const netCredit = calculateNetCredit(contracts);
  const totalCollateral =
    contracts.length > 0 && calculateCollateral
      ? calculateCollateral({ contracts, currentStockPrice })
      : 0;

  const collateral =
    totalCollateral === 0
      ? null
      : {
          title: "Collateral",
          value: totalCollateral,
          formattedValue: `$${totalCollateral.toFixed(2)}`,
          icon: "",
        };

  const roi = calculateRoi({
    netCredit: netCredit.value,
    collateral: collateral?.value ?? 0,
    equity,
    contracts,
    currentStockPrice,
    daysToProfitCalculation,
  });

  const pop = calculateProbabilityOfProfit({
    breakEvens: breakEvens.value,
    currentStockPrice,
    daysToProfitCalculation,
    contracts,
    dividend,
    calculateProfitAtPrice,
  });

  return {
    ...minMaxProfit,
    breakEvens: breakEvens,
    netCredit: netCredit,
    ...(collateral ? { collateral: collateral } : {}),
    ...(roi ? { roi: roi } : {}),
    ...(pop ? { probabilityOfProfit: pop } : {}),
  };
}

/**
 * min and max profit occur when the stock price is either equal to a strike price, at 0, or infinitely large.
 * This function checks the profit at those values and returns min and max.
 */
function calculateMinMaxProfit(
  strikePrices: number[],
  calculateProfitAtPrice: (price: number) => number
) {
  const profitAtStrikePrices = [0, ...strikePrices].map((strikePrice) =>
    calculateProfitAtPrice(strikePrice)
  );
  const maxProfitAtStrikes = Math.max(...profitAtStrikePrices);
  const maxLossAtStrikes = Math.min(...profitAtStrikePrices);
  const profitAtLargeStockPrices = calculateProfitAtPrice(
    Math.max(...strikePrices) + 100
  );
  const hasUnlimitedProfit = profitAtLargeStockPrices > maxProfitAtStrikes + 1;
  const hasUnlimitedLoss = profitAtLargeStockPrices < maxLossAtStrikes - 1;

  return {
    maxProfit: {
      title: "Max Profit",
      value: hasUnlimitedProfit ? Infinity : maxProfitAtStrikes,
      formattedValue: hasUnlimitedProfit
        ? "∞"
        : `$${maxProfitAtStrikes.toFixed(2)}`,
      icon: "/Icons/MaxProfit.svg",
    },
    maxLoss: {
      title: "Max Loss",
      value: hasUnlimitedLoss ? -Infinity : maxLossAtStrikes,
      formattedValue: hasUnlimitedLoss
        ? "∞"
        : `$${(-1 * maxLossAtStrikes).toFixed(2)}`,
      icon: "/Icons/MaxLoss.svg",
    },
  };
}

/**
 * At break even prices the profit is exactly 0. This function finds the zero crossings of the profit function
 * by using the bisection method. It first checks the profit at all interesting stock prices and finds pairs of
 * prices between which the profit changes from positive to negative or vice versa, which means the break even
 * price must be somewhere in between. It then finds the break even price using the bisection method.
 */
function calculateBreakEvens(
  strikePrices: number[],
  currentStockPrice: number,
  calculateProfitAtPrice: (price: number) => number
) {
  const largestBoundary = Math.max(...strikePrices, currentStockPrice) + 100;
  const interestingPrices = [
    0,
    ...strikePrices,
    currentStockPrice,
    largestBoundary,
  ].sort((a, b) => a - b);
  const profitAtInterestingPrices = interestingPrices.map((price) => ({
    price,
    profit: calculateProfitAtPrice(price),
  }));

  const leftBoundaryIndexes = profitAtInterestingPrices
    .map((_, index) => index)
    .filter((index) => {
      if (
        index < profitAtInterestingPrices.length - 1 &&
        profitAtInterestingPrices[index].profit *
          profitAtInterestingPrices[index + 1].profit <=
          0
      ) {
        return true;
      }
    });

  const breakEvens = leftBoundaryIndexes.map((leftIndex) =>
    calculateBreakEven(
      profitAtInterestingPrices[leftIndex],
      profitAtInterestingPrices[leftIndex + 1],
      calculateProfitAtPrice
    )
  );
  const filteredBreakEvens = breakEvens.filter(
    (value): value is number => value !== undefined
  );

  return {
    title: "Break Even" + (filteredBreakEvens.length > 1 ? "s" : ""),
    value: filteredBreakEvens,
    formattedValue: filteredBreakEvens
      .map((value) => "$" + value.toFixed(2))
      .join(", "),
    icon: "",
  };
}

const PRECISION = 0.001;
function calculateBreakEven(
  leftBoundary: { price: number; profit: number },
  rightBoundary: { price: number; profit: number },
  calculateProfitAtPrice: (price: number) => number
) {
  while (
    Math.abs(leftBoundary.profit) > PRECISION &&
    Math.abs(rightBoundary.profit) > PRECISION
  ) {
    const midPrice = 0.5 * (rightBoundary.price + leftBoundary.price);
    const midProfit = calculateProfitAtPrice(midPrice);
    if (midProfit * leftBoundary.profit <= 0) {
      rightBoundary.price = midPrice;
      rightBoundary.profit = midProfit;
    } else {
      leftBoundary.price = midPrice;
      leftBoundary.profit = midProfit;
    }
  }
  if (Math.abs(leftBoundary.profit) < PRECISION) {
    return leftBoundary.price;
  }
  if (Math.abs(rightBoundary.profit) < PRECISION) {
    return rightBoundary.price;
  }
}

export function calculateNetCredit(contracts: CalculatorOption[]) {
  const netCredit = contracts.reduce(
    (totalPrice, contract) =>
      totalPrice +
      (contract.position === "Long" ? -1 : 1) *
        contract.optionPrice *
        contract.contractsCount *
        100,
    0
  );

  return {
    title: netCredit > 0 ? "Net Credit" : "Net Debit",
    value: netCredit,
    formattedValue:
      netCredit > 0
        ? `$${netCredit.toFixed(2)}`
        : `$${(-1 * netCredit).toFixed(2)}`,
    icon: "/Icons/Dollar.svg",
  };
}

type CalculateRoi = {
  netCredit: number;
  collateral: number;
  equity: Equity;
  contracts: CalculatorOption[];
  currentStockPrice: number;
  daysToProfitCalculation: number;
};

function calculateRoi({
  netCredit,
  collateral,
  equity,
  contracts,
  currentStockPrice,
  daysToProfitCalculation,
}: CalculateRoi) {
  if (netCredit < 0) {
    return null;
  }

  const totalEquity =
    equity.position === Position.Long ? currentStockPrice * equity.shares : 0;
  const totalInvestment = collateral + totalEquity;
  const itmWriteOptions = contracts.reduce(
    (totalItm, contract) =>
      totalItm + calculateItmWriteOption(contract, currentStockPrice),
    0
  );
  const roi =
    ((netCredit - itmWriteOptions) / totalInvestment) *
    (365.25 / daysToProfitCalculation);
  return {
    title: "ROI",
    value: roi,
    formattedValue: `${(roi * 100).toFixed(2)}%`,
    icon: "/Icons/ROI.svg",
  };
}

function calculateItmWriteOption(
  contract: CalculatorOption,
  currentStockPrice: number
) {
  if (
    contract.position === Position.Short &&
    contract.optionType === OptionType.Call &&
    currentStockPrice > contract.strikePrice
  ) {
    return (
      (currentStockPrice - contract.strikePrice) * contract.contractsCount * 100
    );
  }

  if (
    contract.position === Position.Short &&
    contract.optionType === OptionType.Put &&
    currentStockPrice < contract.strikePrice
  ) {
    return (
      (contract.strikePrice - currentStockPrice) * contract.contractsCount * 100
    );
  }
  return 0;
}

type ProbabilityOfProfit = {
  breakEvens: (number | undefined)[];
  currentStockPrice: number;
  daysToProfitCalculation: number;
  contracts: CalculatorOption[];
  dividend: number;
  calculateProfitAtPrice: (price: number) => number;
};

function calculateProbabilityOfProfit({
  breakEvens,
  currentStockPrice,
  daysToProfitCalculation,
  contracts,
  dividend,
  calculateProfitAtPrice,
}: ProbabilityOfProfit) {
  const { volatility } = contracts[0];
  if (breakEvens.length === 1 && breakEvens[0]) {
    const breakEven = breakEvens[0];
    const profitAboveBreakEven = calculateProfitAtPrice(breakEven + 5);
    const profitDirection = profitAboveBreakEven > 0 ? "above" : "below";
    const estimate = profitEstimate({
      stockPrice: currentStockPrice,
      breakEven,
      volatility: volatility / 100,
      timeToExpiration: getTimeParameter(daysToProfitCalculation),
      profitDirection,
      dividend,
    });

    return {
      title: "Chance of Profit",
      value: estimate,
      formattedValue: isNaN(estimate)
        ? "N/A"
        : `${Math.min(estimate * 100, 99).toFixed()}%`,
      icon: "/Icons/ProbOfProfit.svg",
    };
  }

  if (breakEvens.length === 2 && breakEvens[0] && breakEvens[1]) {
    const breakEvenLow = Math.min(breakEvens[0], breakEvens[1]);
    const breakEvenHigh = Math.max(breakEvens[0], breakEvens[1]);
    const profitMiddle = calculateProfitAtPrice(
      0.5 * (breakEvenLow + breakEvenHigh)
    );
    let estimate;
    if (profitMiddle > 0) {
      estimate =
        profitEstimate({
          stockPrice: currentStockPrice,
          breakEven: breakEvenLow,
          volatility: volatility / 100,
          timeToExpiration: getTimeParameter(daysToProfitCalculation),
          profitDirection: "above",
          dividend,
        }) -
        profitEstimate({
          stockPrice: currentStockPrice,
          breakEven: breakEvenHigh,
          volatility: volatility / 100,
          timeToExpiration: getTimeParameter(daysToProfitCalculation),
          profitDirection: "above",
          dividend,
        });
    } else {
      estimate =
        profitEstimate({
          stockPrice: currentStockPrice,
          breakEven: breakEvenLow,
          volatility: volatility / 100,
          timeToExpiration: getTimeParameter(daysToProfitCalculation),
          profitDirection: "below",
          dividend,
        }) +
        profitEstimate({
          stockPrice: currentStockPrice,
          breakEven: breakEvenHigh,
          volatility: volatility / 100,
          timeToExpiration: getTimeParameter(daysToProfitCalculation),
          profitDirection: "above",
          dividend,
        });
    }
    return {
      title: "Chance of Profit",
      value: estimate,
      formattedValue: isNaN(estimate)
        ? "N/A"
        : `${Math.min(estimate * 100, 99).toFixed()}%`,
      icon: "/Icons/ProbOfProfit.svg",
    };
  }
}
