import { buildContract } from "@utils/builders/contractBuilder";
import { calculateProfit } from "./calculateProfit";
import * as BlackScholes from "./blackScholes";
import { OptionType, Position } from "optionscout-database";

jest.mock("./blackScholes", () => ({
  ...jest.requireActual("./blackScholes"),
  blackScholes: jest.fn(),
}));

describe("calculateProfit", () => {
  it("returns 0 for empty contract list", () => {
    const profit = calculateProfit({
      contracts: [],
      equity: { position: Position.Long, shares: 0 },
      currentStockPrice: 0,
      expirationStockPrice: 0,
      daysToProfitCalculation: 1,
      dividend: 0,
    });

    expect(profit).toBe(0);
  });

  it("returns positive profit for long call with stock price above strike price", () => {
    const contract = buildContract({
      optionPrice: 10,
      optionType: OptionType.Call,
      strikePrice: 100,
      position: Position.Long,
      daysToExpiration: 10,
    });

    const profit = calculateProfit({
      contracts: [contract],
      equity: { position: Position.Long, shares: 0 },
      currentStockPrice: 0,
      expirationStockPrice: 120,
      daysToProfitCalculation: 10,
      dividend: 0,
    });

    // (120 (price at expiration) - 100 (strike price) - 10 (option price)) * 100 = 1000
    expect(profit).toBe(1000);
  });

  it("returns negative profit for long call with stock price below strike price", () => {
    const contract = buildContract({
      optionPrice: 10,
      optionType: OptionType.Call,
      strikePrice: 100,
      position: Position.Long,
      daysToExpiration: 10,
      contractsCount: 5,
    });

    const profit = calculateProfit({
      contracts: [contract],
      equity: { position: Position.Long, shares: 0 },
      currentStockPrice: 0,
      expirationStockPrice: 95,
      daysToProfitCalculation: 10,
      dividend: 0,
    });

    // (10 (option price)) * 100 * 5 = 5000
    expect(profit).toBe(-5000);
  });

  it("returns positive profit for long put with stock price below strike price", () => {
    const contract = buildContract({
      optionPrice: 10,
      optionType: OptionType.Put,
      strikePrice: 100,
      position: Position.Long,
      daysToExpiration: 10,
    });

    const profit = calculateProfit({
      contracts: [contract],
      equity: { position: Position.Long, shares: 0 },
      currentStockPrice: 0,
      expirationStockPrice: 80,
      daysToProfitCalculation: 10,
      dividend: 0,
    });

    // (100 (strike price) - 80 (price at expiration) - 10 (option price)) * 100 = 1000
    expect(profit).toBe(1000);
  });

  it("returns negative profit for long put with stock price above strike price", () => {
    const contract = buildContract({
      optionPrice: 10,
      optionType: OptionType.Put,
      strikePrice: 100,
      position: Position.Long,
      daysToExpiration: 10,
    });

    const profit = calculateProfit({
      contracts: [contract],
      equity: { position: Position.Long, shares: 0 },
      currentStockPrice: 0,
      expirationStockPrice: 120,
      daysToProfitCalculation: 10,
      dividend: 0,
    });

    // 10 (option price) * 100 = 1000
    expect(profit).toBe(-1000);
  });

  it("returns negative profit for short call with stock price above strike price", () => {
    const contract = buildContract({
      optionPrice: 5,
      optionType: OptionType.Call,
      strikePrice: 100,
      position: Position.Short,
      daysToExpiration: 10,
    });

    const profit = calculateProfit({
      contracts: [contract],
      equity: { position: Position.Long, shares: 0 },
      currentStockPrice: 0,
      expirationStockPrice: 120,
      daysToProfitCalculation: 10,
      dividend: 0,
    });

    // (120 (price at expiration) - 100 (strike price) - 5 (option price)) * 100 = 1500
    expect(profit).toBe(-1500);
  });

  it("returns positive profit for short call with stock price below strike price", () => {
    const contract = buildContract({
      optionPrice: 5,
      optionType: OptionType.Call,
      strikePrice: 100,
      position: Position.Short,
      daysToExpiration: 10,
    });

    const profit = calculateProfit({
      contracts: [contract],
      equity: { position: Position.Long, shares: 0 },
      currentStockPrice: 0,
      expirationStockPrice: 70,
      daysToProfitCalculation: 10,
      dividend: 0,
    });

    // (5 (option price)) * 100 = 500
    expect(profit).toBe(500);
  });

  it("returns positive profit for short put with stock price above strike price", () => {
    const contract = buildContract({
      optionPrice: 5,
      optionType: OptionType.Put,
      strikePrice: 100,
      position: Position.Short,
      daysToExpiration: 10,
    });

    const profit = calculateProfit({
      contracts: [contract],
      equity: { position: Position.Long, shares: 0 },
      currentStockPrice: 0,
      expirationStockPrice: 150,
      daysToProfitCalculation: 10,
      dividend: 0,
    });

    // (5 (option price)) * 100 = 500
    expect(profit).toBe(500);
  });

  it("returns negative profit for short put with stock price below strike price", () => {
    const contract = buildContract({
      optionPrice: 5,
      optionType: OptionType.Put,
      strikePrice: 100,
      position: Position.Short,
      daysToExpiration: 10,
    });

    const profit = calculateProfit({
      contracts: [contract],
      equity: { position: Position.Long, shares: 0 },
      currentStockPrice: 0,
      expirationStockPrice: 70,
      daysToProfitCalculation: 10,
      dividend: 0,
    });

    // (100 (strike price) - 70 (price at expiration) - 5 (option price)) * 100 = 2500
    expect(profit).toBe(-2500);
  });

  it("returns triple profit for 3 contracts", () => {
    const contract = buildContract({
      optionPrice: 10,
      optionType: OptionType.Call,
      strikePrice: 100,
      position: Position.Long,
      daysToExpiration: 10,
      contractsCount: 3,
    });

    const profit = calculateProfit({
      contracts: [contract],
      equity: { position: Position.Long, shares: 0 },
      currentStockPrice: 0,
      expirationStockPrice: 120,
      daysToProfitCalculation: 10,
      dividend: 0,
    });

    // (120 (price at expiration) - 100 (strike price) - 10 (option price)) * 100 * 3 = 3000
    expect(profit).toBe(3000);
  });

  it("includes profit from stock price increase if owning equity is part of the strategy", () => {
    const contract = buildContract({
      optionPrice: 5,
      optionType: OptionType.Call,
      strikePrice: 110,
      position: Position.Short,
      daysToExpiration: 10,
    });

    const profit = calculateProfit({
      contracts: [contract],
      equity: { position: Position.Long, shares: 100 },
      currentStockPrice: 100,
      expirationStockPrice: 150,
      daysToProfitCalculation: 10,
      dividend: 0,
    });

    // (110 (strike price) - 100 (stock price today) + 5 (option price)) * 100 = 1500
    expect(profit).toBe(1500);
  });

  it("uses black scholes to estimate profit of options that are not expired", () => {
    const blackScholesMock = jest
      .spyOn(BlackScholes, "blackScholes")
      .mockReturnValue(13);

    const openOption = buildContract({
      optionPrice: 10,
      optionType: OptionType.Call,
      strikePrice: 110,
      position: Position.Long,
      daysToExpiration: 20,
      volatility: 10,
    });

    const profit = calculateProfit({
      contracts: [openOption],
      equity: { position: Position.Long, shares: 0 },
      currentStockPrice: 100,
      expirationStockPrice: 100,
      daysToProfitCalculation: 10,
      dividend: 3,
    });

    expect(blackScholesMock).toHaveBeenCalledWith({
      optionType: openOption.optionType,
      stockPrice: 100,
      strikePrice: openOption.strikePrice,
      timeToExpiration: (20 - 10) / 365,
      volatility: openOption.volatility / 100,
      dividend: 3,
    });

    // (13 (black scholes estimate) - 10 (option price)) * 100 = 300
    expect(profit).toBe(300);
  });
});
