import { OptionType } from "optionscout-database";
import { addDays, differenceInBusinessDays } from "date-fns";
import { erf } from "mathjs";

// load risk free interest rate from env variable set in next.config.mjs
const INTEREST_RATE = process.env.riskFreeRate
  ? Number(process.env.riskFreeRate)
  : 0.03;

type BlackScholes = {
  stockPrice: number;
  strikePrice: number;
  volatility: number;
  timeToExpiration: number;
  optionType: OptionType;
  dividend: number;
  interestRate?: number;
};

export function blackScholes({
  stockPrice,
  strikePrice,
  volatility,
  timeToExpiration,
  optionType,
  dividend,
  interestRate = INTEREST_RATE,
}: BlackScholes) {
  const { d1, d2 } = calculateParameters({
    stockPrice,
    strikePrice,
    volatility,
    timeToExpiration,
    dividend,
    interestRate,
  });

  if (optionType === OptionType.Call) {
    return (
      stockPrice * cdf(d1) * Math.exp(-(dividend * timeToExpiration)) -
      strikePrice * Math.exp(-(interestRate * timeToExpiration)) * cdf(d2)
    );
  }
  return (
    strikePrice * Math.exp(-(interestRate * timeToExpiration)) * cdf(-d2) -
    stockPrice * cdf(-d1) * Math.exp(-(dividend * timeToExpiration))
  );
}

function calculateParameters({
  stockPrice,
  strikePrice,
  volatility,
  timeToExpiration,
  dividend,
  interestRate = INTEREST_RATE,
}: Omit<BlackScholes, "optionType">) {
  const d1 =
    (Math.log(stockPrice / strikePrice) +
      (interestRate - dividend + (volatility * volatility) / 2.0) *
        timeToExpiration) /
    (volatility * Math.sqrt(timeToExpiration));
  const d2 = d1 - volatility * Math.sqrt(timeToExpiration);

  return { d1, d2 };
}

function cdf(x: number) {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

type ProfitEstimate = {
  stockPrice: BlackScholes["stockPrice"];
  breakEven: number;
  volatility: BlackScholes["volatility"];
  timeToExpiration: BlackScholes["timeToExpiration"];
  profitDirection: "above" | "below";
  dividend: BlackScholes["dividend"];
  interestRate?: BlackScholes["interestRate"];
};

export function profitEstimate({
  stockPrice,
  breakEven,
  volatility,
  timeToExpiration,
  profitDirection,
  dividend,
  interestRate = INTEREST_RATE,
}: ProfitEstimate) {
  const { d2 } = calculateParameters({
    stockPrice,
    strikePrice: breakEven,
    volatility,
    timeToExpiration,
    dividend,
    interestRate,
  });
  if (profitDirection === "above") {
    return cdf(d2);
  }
  return cdf(-d2);
}

export function getTimeParameter(daysToProfitCalculation: number) {
  const tradingDaysToCalculation = differenceInBusinessDays(
    addDays(new Date(), daysToProfitCalculation),
    new Date()
  );
  const yearlyTradingDays = 252;
  return (tradingDaysToCalculation + 1) / yearlyTradingDays;
}
