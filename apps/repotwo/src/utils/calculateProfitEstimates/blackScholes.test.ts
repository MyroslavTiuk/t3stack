import { OptionType } from "optionscout-database";
import { blackScholes, profitEstimate } from "./blackScholes";

// test cases calculated with https://goodcalculators.com/black-scholes-calculator/
const testCases = [
  {
    input: {
      stockPrice: 300,
      strikePrice: 250,
      volatility: 0.15,
      timeToExpiration: 1,
      optionType: OptionType.Call,
      dividend: 0.05,
      interestRate: 0.03,
    },
    expectedPrice: "45.56",
  },
  {
    input: {
      stockPrice: 300,
      strikePrice: 250,
      volatility: 0.15,
      timeToExpiration: 1,
      optionType: OptionType.Put,
      dividend: 0.05,
      interestRate: 0.03,
    },
    expectedPrice: "2.80",
  },
  {
    input: {
      stockPrice: 140,
      strikePrice: 150,
      volatility: 0.3,
      timeToExpiration: 1 / 12,
      optionType: OptionType.Call,
      dividend: 0,
      interestRate: 0.001,
    },
    expectedPrice: "1.52",
  },
  {
    input: {
      stockPrice: 140,
      strikePrice: 150,
      volatility: 0.3,
      timeToExpiration: 1 / 12,
      optionType: OptionType.Put,
      dividend: 0,
      interestRate: 0.001,
    },
    expectedPrice: "11.51",
  },
];

describe("blackScholes", () => {
  testCases.forEach((testCase) => {
    it("calculates test case correctly", () => {
      const price = blackScholes(testCase.input);

      expect(price.toFixed(2)).toEqual(testCase.expectedPrice);
    });
  });
});

// test cases calculated with https://www.optionstrategist.com/calculators/probability
const testCasesProfits = [
  {
    input: {
      stockPrice: 100,
      breakEven: 103,
      volatility: 0.2,
      timeToExpiration: 10 / 365.25,
      profitDirection: "above" as const,
      dividend: 0,
    },
    expectedProbability: "0.19",
  },
  {
    input: {
      stockPrice: 100,
      breakEven: 103,
      volatility: 0.2,
      timeToExpiration: 10 / 365.25,
      profitDirection: "below" as const,
      dividend: 0,
    },
    expectedProbability: "0.81",
  },
  {
    input: {
      stockPrice: 20,
      breakEven: 18,
      volatility: 0.4,
      timeToExpiration: 50 / 365.25,
      profitDirection: "above" as const,
      dividend: 0,
    },
    expectedProbability: "0.75",
  },
  {
    input: {
      stockPrice: 20,
      breakEven: 18,
      volatility: 0.4,
      timeToExpiration: 50 / 365.25,
      profitDirection: "below" as const,
      dividend: 0,
    },
    expectedProbability: "0.25",
  },
];

describe("estimateProfits", () => {
  testCasesProfits.forEach((testCase) => {
    it("calculates test case correctly", () => {
      const estimate = profitEstimate(testCase.input);

      expect(estimate.toFixed(2)).toEqual(testCase.expectedProbability);
    });
  });
});
