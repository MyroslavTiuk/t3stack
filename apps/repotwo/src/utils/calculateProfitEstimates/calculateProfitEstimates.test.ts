import { OptionType, Position } from "optionscout-database";
import { buildContract } from "@utils/builders/contractBuilder";
import {
  calculateCashSecuredPut,
  calculateIronCondor,
} from "./calculateCollateral";
import { calculateProfitEstimates } from "./calculateProfitEstimates";

describe("calculateProfitEstimates", () => {
  it("calculates correct estimates for covered call", () => {
    const estimates = calculateProfitEstimates({
      contracts: [
        buildContract({
          optionPrice: 10,
          optionType: OptionType.Call,
          strikePrice: 110,
          position: Position.Short,
          daysToExpiration: 10,
          volatility: 30,
        }),
      ],
      currentStockPrice: 100,
      dividend: 0,
      daysToProfitCalculation: 10,
      equity: { position: Position.Long, shares: 100 },
      calculateCollateral: undefined,
    });

    expect(Object.keys(estimates).length).toBe(6);

    // Max Profit: (10 (premium) + 110 (strike) - 100 (current)) * 100 = 2000
    expect(estimates.maxProfit.value).toBe(2000.0);
    expect(estimates.maxProfit.formattedValue).toBe("$2000.00");

    // Max Loss: (100 (current) - 10 (premium)) * 100 = 9000
    expect(estimates.maxLoss.formattedValue).toBe("$9000.00");

    // Net Credit: (10 (premium)) * 100 = 1000
    expect(estimates.netCredit.formattedValue).toBe("$1000.00");

    // Breakeven: 100 (current) - 10 (premium) = 90
    expect(estimates.breakEvens.formattedValue).toBe("$90.00");

    // ROI: (1000 (net credit) / (10000 (equity)) * (365.25 / 10 (days)) = 3.65
    expect(estimates.roi?.formattedValue).toBe("365.25%");

    // Probability of Profit: probability stock stays above 90, currently at 100
    expect(estimates.probabilityOfProfit?.value).toBeGreaterThanOrEqual(0.9);
    expect(estimates.probabilityOfProfit?.value).toBeLessThanOrEqual(1);
  });

  it("calculates correct estimates for long call", () => {
    const estimates = calculateProfitEstimates({
      contracts: [
        buildContract({
          optionPrice: 5,
          optionType: OptionType.Call,
          strikePrice: 200,
          position: Position.Long,
          daysToExpiration: 3,
          contractsCount: 5,
        }),
      ],
      currentStockPrice: 150,
      dividend: 0,
      daysToProfitCalculation: 3,
      equity: { position: Position.Long, shares: 0 },
      calculateCollateral: undefined,
    });

    expect(Object.keys(estimates).length).toBe(5);

    // Max Profit: infinite
    expect(estimates.maxProfit.formattedValue).toBe("∞");

    // Max Loss: 5 (premium) * 5 (contracts) * 100 = 2500
    expect(estimates.maxLoss.formattedValue).toBe("$2500.00");

    // Net Debit: 5 (premium) * 5 (contracts) * 100 = 2500
    expect(estimates.netCredit.title).toBe("Net Debit");
    expect(estimates.netCredit.formattedValue).toBe("$2500.00");

    // Breakeven: 200 (strike) + 5 (premium) = 205
    expect(estimates.breakEvens.formattedValue).toBe("$205.00");

    // Probability of Profit: probability stock jumps above 205, currently at 150
    expect(estimates.probabilityOfProfit?.formattedValue).toBe("0%");
  });

  it("calculates correct estimates for cash secured put", () => {
    const estimates = calculateProfitEstimates({
      contracts: [
        buildContract({
          optionPrice: 2,
          optionType: OptionType.Put,
          strikePrice: 10,
          position: Position.Short,
          daysToExpiration: 3,
          contractsCount: 10,
        }),
      ],
      currentStockPrice: 30,
      dividend: 0,
      daysToProfitCalculation: 3,
      equity: { position: Position.Long, shares: 0 },
      calculateCollateral: calculateCashSecuredPut,
    });

    expect(Object.keys(estimates).length).toBe(7);

    // Max Profit: 2 (premium) * 10 (contracts) * 100 = 2000
    expect(estimates.maxProfit.formattedValue).toBe("$2000.00");

    // Max Loss: (10 (strike) - 2 (premium)) * 10 (contracts) * 100 = 8000
    expect(estimates.maxLoss.formattedValue).toBe("$8000.00");

    // Net Credit: 2 (premium) * 10 (contracts) * 100 = 2000
    expect(estimates.netCredit.title).toBe("Net Credit");
    expect(estimates.netCredit.formattedValue).toBe("$2000.00");

    // Breakeven: 10 (strike) - 2 (premium) = 8
    expect(estimates.breakEvens.formattedValue).toBe("$8.00");

    // Collateral: 10 (strike) * 10 (contracts) * 100 = 10000
    expect(estimates.collateral?.formattedValue).toBe("$10000.00");

    // ROI: (2000 (max profit) / 10000 (collateral)) * (365.25 / 3 (days)) = 24.35
    expect(estimates.roi?.formattedValue).toBe("2435.00%");

    // Probability of Profit: probability stock stays above 8, currently at 30
    expect(estimates.probabilityOfProfit?.formattedValue).toBe("99%");
  });

  it("calculates correct estimates for long call spread", () => {
    // example values taken from optionstrat.com
    const estimates = calculateProfitEstimates({
      contracts: [
        buildContract({
          optionPrice: 17.5,
          optionType: OptionType.Call,
          strikePrice: 305,
          position: Position.Long,
          daysToExpiration: 33,
        }),
        buildContract({
          optionPrice: 7.63,
          optionType: OptionType.Call,
          strikePrice: 330,
          position: Position.Short,
          daysToExpiration: 33,
        }),
      ],
      currentStockPrice: 303.86,
      dividend: 0,
      daysToProfitCalculation: 33,
      equity: { position: Position.Long, shares: 0 },
      calculateCollateral: undefined,
    });

    expect(Object.keys(estimates).length).toBe(5);

    expect(estimates.maxProfit.formattedValue).toBe("$1513.00");

    expect(estimates.maxLoss.formattedValue).toBe("$987.00");

    expect(estimates.netCredit.title).toBe("Net Debit");
    expect(estimates.netCredit.formattedValue).toBe("$987.00");

    expect(estimates.breakEvens.formattedValue).toBe("$314.87");

    // Probability of Profit: probability stock goes above 314, currently at 303
    expect(estimates.probabilityOfProfit?.value).toBeGreaterThanOrEqual(0.1);
    expect(estimates.probabilityOfProfit?.value).toBeLessThanOrEqual(0.2);
  });

  it("calculates correct estimates for poor man's covered call", () => {
    const estimates = calculateProfitEstimates({
      contracts: [
        buildContract({
          optionPrice: 10,
          optionType: OptionType.Call,
          strikePrice: 290,
          position: Position.Long,
          daysToExpiration: 20,
        }),
        buildContract({
          optionPrice: 5,
          optionType: OptionType.Call,
          strikePrice: 310,
          position: Position.Short,
          daysToExpiration: 10,
        }),
      ],
      currentStockPrice: 300,
      dividend: 0,
      daysToProfitCalculation: 10,
      equity: { position: Position.Long, shares: 0 },
      calculateCollateral: undefined,
    });

    expect(Object.keys(estimates).length).toBe(5);

    // Max. Profit: cannot be calculated precisely, uses Black-Scholes estimates
    // estimation formula: (310 (long strike) - 290 (short strike) - 10 (long premium) + 5 (short premium)) * 100 = 1500
    expect(estimates.maxProfit.value).toBeGreaterThanOrEqual(1500);
    expect(estimates.maxProfit.value).toBeLessThanOrEqual(1600);

    // Max Loss: (10 (long premium) - 5 (short premium)) * 100 = 500
    expect(estimates.maxLoss.formattedValue).toBe("$500.00");

    // Net Debit: (10 (long premium) - 5 (short premium)) * 100 = 500
    expect(estimates.netCredit.title).toBe("Net Debit");
    expect(estimates.netCredit.formattedValue).toBe("$500.00");

    // Break even: cannot be calculated precisely, uses Black-Scholes estimates
    expect(estimates.breakEvens.value[0]).toBeGreaterThanOrEqual(290);
    expect(estimates.breakEvens.value[0]).toBeLessThanOrEqual(300);

    // Prob of Profit: uses Black-Scholes estimates
    expect(estimates.probabilityOfProfit?.value).toBeGreaterThanOrEqual(0.7);
    expect(estimates.probabilityOfProfit?.value).toBeLessThanOrEqual(0.9);
  });

  it("calculates correct estimates for long call calendar spread", () => {
    // example values taken from optionstrat.com
    const estimates = calculateProfitEstimates({
      contracts: [
        buildContract({
          optionPrice: 8,
          optionType: OptionType.Call,
          strikePrice: 165,
          position: Position.Long,
          daysToExpiration: 66,
          volatility: 29,
        }),
        buildContract({
          optionPrice: 4.75,
          optionType: OptionType.Call,
          strikePrice: 165,
          position: Position.Short,
          daysToExpiration: 32,
          volatility: 29,
        }),
      ],
      currentStockPrice: 163.46,
      dividend: 0,
      daysToProfitCalculation: 32,
      equity: { position: Position.Long, shares: 0 },
      calculateCollateral: undefined,
    });

    expect(Object.keys(estimates).length).toBe(5);

    // Max. Profit: cannot be calculated precisely, uses Black-Scholes estimates, value from optionstrat when risk free rate was much lower: $301.91
    expect(estimates.maxProfit.value).toBeGreaterThanOrEqual(270);
    expect(estimates.maxProfit.value).toBeLessThanOrEqual(300);

    expect(estimates.maxLoss.formattedValue).toBe("$325.00");

    expect(estimates.netCredit.title).toBe("Net Debit");
    expect(estimates.netCredit.formattedValue).toBe("$325.00");

    // Break even: cannot be calculated precisely, uses Black-Scholes estimates, values from optionstrat when risk free rate was much lower: $158.11, $173.17
    expect(estimates.breakEvens.value[0]).toBeGreaterThanOrEqual(150);
    expect(estimates.breakEvens.value[0]).toBeLessThanOrEqual(160);
    expect(estimates.breakEvens.value[1]).toBeGreaterThanOrEqual(170);
    expect(estimates.breakEvens.value[1]).toBeLessThanOrEqual(180);

    // Probability of Profit: probability stock stays between 158 and 172
    expect(estimates.probabilityOfProfit?.value).toBeGreaterThanOrEqual(0.3);
    expect(estimates.probabilityOfProfit?.value).toBeLessThanOrEqual(0.5);
  });

  it("calculates correct estimates for iron condor", () => {
    // example values taken from optionstrat.com
    const estimates = calculateProfitEstimates({
      contracts: [
        buildContract({
          optionPrice: 0.52,
          optionType: OptionType.Put,
          strikePrice: 138,
          position: Position.Long,
          daysToExpiration: 32,
          volatility: 40,
        }),
        buildContract({
          optionPrice: 1.56,
          optionType: OptionType.Put,
          strikePrice: 150,
          position: Position.Short,
          daysToExpiration: 32,
        }),
        buildContract({
          optionPrice: 1.22,
          optionType: OptionType.Call,
          strikePrice: 175,
          position: Position.Short,
          daysToExpiration: 32,
        }),
        buildContract({
          optionPrice: 0.11,
          optionType: OptionType.Call,
          strikePrice: 190,
          position: Position.Long,
          daysToExpiration: 32,
        }),
      ],
      currentStockPrice: 163.46,
      dividend: 0,
      daysToProfitCalculation: 32,
      equity: { position: Position.Long, shares: 0 },
      calculateCollateral: calculateIronCondor,
    });

    expect(Object.keys(estimates).length).toBe(7);

    expect(estimates.maxProfit.formattedValue).toBe("$215.00");
    expect(estimates.maxLoss.formattedValue).toBe("$1285.00");
    expect(estimates.netCredit.title).toBe("Net Credit");
    expect(estimates.netCredit.formattedValue).toBe("$215.00");
    expect(estimates.breakEvens.formattedValue).toBe("$147.85, $177.15");

    // Collateral: 15 (call difference) * 100 = 1500
    expect(estimates.collateral?.formattedValue).toBe("$1500.00");

    // ROI: (215 (max profit) / 1500  (collateral)) * (365.25 / 32 (days)) = 1.64
    expect(estimates.roi?.formattedValue).toBe("163.60%");

    // Probability of Profit: black scholes estimate
    expect(estimates.probabilityOfProfit?.value).toBeGreaterThanOrEqual(0.4);
    expect(estimates.probabilityOfProfit?.value).toBeLessThanOrEqual(0.6);
  });
});
