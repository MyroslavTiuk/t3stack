import { OptionType, Position } from "optionscout-database";
import { buildContract } from "@utils/builders/contractBuilder";
import {
  calculateIronCondor,
  calculateNakedCall,
  calculateNakedPut,
  calculateShortCallButterfly,
  calculateShortCallSpread,
  calculateShortPutButterfly,
  calculateShortPutSpread,
  calculateShortStraddle,
} from "./calculateCollateral";

describe("calculateShortCallSpread", () => {
  it("returns 0 for when only contract is selected", () => {
    const collateral = calculateShortCallSpread({
      contracts: [buildContract({})],
      currentStockPrice: 100,
    });

    expect(collateral).toBe(0);
  });

  it("calculates collateral correctly", () => {
    const contracts = [
      buildContract({
        optionPrice: 1.4,
        position: Position.Short,
        strikePrice: 100,
      }),
      buildContract({
        optionPrice: 1.05,
        position: Position.Long,
        strikePrice: 101,
      }),
    ];
    const collateral = calculateShortCallSpread({
      contracts,
      currentStockPrice: 0,
    });

    expect(collateral.toFixed(2)).toBe("65.00");
  });
});

describe("calculateShortPutSpread", () => {
  it("returns 0 for when only contract is selected", () => {
    const collateral = calculateShortPutSpread({
      contracts: [buildContract({})],
      currentStockPrice: 100,
    });

    expect(collateral).toBe(0);
  });

  it("calculates collateral correctly", () => {
    const contracts = [
      buildContract({
        optionPrice: 1.4,
        position: Position.Short,
        strikePrice: 100,
      }),
      buildContract({
        optionPrice: 1.05,
        position: Position.Long,
        strikePrice: 101,
      }),
    ];
    const collateral = calculateShortPutSpread({
      contracts,
      currentStockPrice: 0,
    });

    expect(collateral.toFixed(2)).toBe("65.00");
  });
});

describe("calculateNakedPut", () => {
  it("returns first formula's result if it's the highest", () => {
    const collateral = calculateNakedPut({
      contracts: [
        buildContract({
          position: Position.Short,
          optionType: OptionType.Put,
          strikePrice: 99,
          optionPrice: 3,
          contractsCount: 10,
        }),
      ],
      currentStockPrice: 100,
    });

    // 1st formula (20% of 100 (stock price) - 1 (otm)  + 3 (premium)) * 10 * 100 = 22000
    // 2nd formula (10% of 99 (strike price)  + 3 (premium)) * 10 * 100 = 12900
    // 3rd formula 2.50 * 10 * 100 = 2500
    expect(collateral).toBe(22000);
  });

  it("returns second formula's result if it's the highest", () => {
    const collateral = calculateNakedPut({
      contracts: [
        buildContract({
          position: Position.Short,
          optionType: OptionType.Put,
          strikePrice: 10,
          optionPrice: 3,
          contractsCount: 10,
        }),
      ],
      currentStockPrice: 100,
    });

    // 1st formula (20% of 100 (stock price) - 90 (otm)  + 3 (premium)) * 10 * 100 = -67000
    // 2nd formula (10% of 10 (strike price)  + 3 (premium)) * 10 * 100 = 4000
    // 3rd formula 2.50 * 10 * 100 = 2500
    expect(collateral).toBe(4000);
  });

  it("returns 3rd formula's result if it's the highest", () => {
    const collateral = calculateNakedPut({
      contracts: [
        buildContract({
          position: Position.Short,
          optionType: OptionType.Put,
          strikePrice: 0.9,
          optionPrice: 0.1,
          contractsCount: 10,
        }),
      ],
      currentStockPrice: 1,
    });

    // 1st formula (20% of 1 (stock price) - 0.1 (otm)  + 0.1 (premium)) * 10 * 100 = 200
    // 2nd formula (10% of 0.9 (strike price)  + 0.1 (premium)) * 10 * 100 = 190
    // 3rd formula 2.50 * 10 * 100 = 2500
    expect(collateral).toBe(2500);
  });
});

describe("calculateShortPutButterfly", () => {
  it("returns 0 for when only one contract is selected", () => {
    const collateral = calculateShortPutButterfly({
      contracts: [buildContract({})],
      currentStockPrice: 100,
    });

    expect(collateral).toBe(0);
  });

  it("returns spread of strike prices", () => {
    const collateral = calculateShortPutButterfly({
      contracts: [
        buildContract({
          position: Position.Short,
          optionType: OptionType.Put,
          strikePrice: 75,
          optionPrice: 1.5,
          contractsCount: 3,
        }),
        buildContract({
          position: Position.Long,
          optionType: OptionType.Put,
          strikePrice: 80,
          optionPrice: 4,
          contractsCount: 3,
        }),
        buildContract({
          position: Position.Short,
          optionType: OptionType.Put,
          strikePrice: 80,
          optionPrice: 4,
          contractsCount: 3,
        }),
        buildContract({
          position: Position.Long,
          optionType: OptionType.Put,
          strikePrice: 85,
          optionPrice: 6,
          contractsCount: 3,
        }),
      ],
      currentStockPrice: 100,
    });

    // see https://support.tastyworks.com/support/solutions/articles/43000435207-short-butterfly?_sp=6b58902e-af7a-4c41-93fc-6cc372cdef5d.1663097535108
    expect(collateral).toBe(1500);
  });
});

describe("calculateNakedCall", () => {
  it("returns first formula's result if it's the highest", () => {
    const collateral = calculateNakedCall({
      contracts: [
        buildContract({
          position: Position.Short,
          optionType: OptionType.Call,
          strikePrice: 68,
          optionPrice: 1.5,
        }),
      ],
      currentStockPrice: 65,
    });

    // 1st formula (20% of 65 (stock price) - 3 (otm)  + 1.5 (premium)) * 100 = 1150
    // 2nd formula (10% of 65 (stock price) + 1.5 (premium)) * 100 = 800
    // 3rd formula 2.50 * 100 = 250
    expect(collateral).toBe(1150);
  });

  it("returns second formula's result if it's the highest", () => {
    const collateral = calculateNakedCall({
      contracts: [
        buildContract({
          position: Position.Short,
          optionType: OptionType.Call,
          strikePrice: 80,
          optionPrice: 1.5,
        }),
      ],
      currentStockPrice: 65,
    });

    // 1st formula (20% of 65 (stock price) - 15 (otm)  + 1.5 (premium)) * 100 = -50
    // 2nd formula (10% of 65 (stock price) + 1.5 (premium)) * 100 = 800
    // 3rd formula 2.50 * 100 = 250
    expect(collateral).toBe(800);
  });

  it("returns third formula's result if it's the highest", () => {
    const collateral = calculateNakedCall({
      contracts: [
        buildContract({
          position: Position.Short,
          optionType: OptionType.Call,
          strikePrice: 7,
          optionPrice: 1.5,
        }),
      ],
      currentStockPrice: 6,
    });

    // 1st formula (20% of 6 (stock price) - 1 (otm)  + 1.5 (premium)) * 100 = 170
    // 2nd formula (10% of 6 (stock price) + 1.5 (premium)) * 100 = 210
    // 3rd formula 2.50 * 100 = 250
    expect(collateral).toBe(250);
  });
});

describe("calculateShortStraddle", () => {
  it("returns call collateral plus put option value if it's larger", () => {
    const collateral = calculateShortStraddle({
      contracts: [
        buildContract({
          position: Position.Short,
          optionType: OptionType.Call,
          strikePrice: 70,
          optionPrice: 5,
          contractsCount: 10,
        }),
        buildContract({
          position: Position.Short,
          optionType: OptionType.Put,
          strikePrice: 70,
          optionPrice: 1.5,
          contractsCount: 10,
        }),
      ],
      currentStockPrice: 72.25,
    });

    // call collateral (20% of 72.25 (stock price) - 0 (otm)  + 5 (premium)) * 10 * 100 = 19450
    // put collateral (20% of 72.25 (stock price) - 2.25 (otm) + 1.5 (premium)) * 10 * 100 = 13700
    // result: 19450 (call collateral) + 1500 (put value) = 20950
    expect(collateral.toFixed()).toBe("20950");
  });

  it("returns put collateral plus call option value if it's larger", () => {
    const collateral = calculateShortStraddle({
      contracts: [
        buildContract({
          position: Position.Short,
          optionType: OptionType.Call,
          strikePrice: 70,
          optionPrice: 5,
          contractsCount: 10,
        }),
        buildContract({
          position: Position.Short,
          optionType: OptionType.Put,
          strikePrice: 70,
          optionPrice: 1.5,
          contractsCount: 10,
        }),
      ],
      currentStockPrice: 65,
    });

    // call collateral (20% of 65 (stock price) - 5 (otm)  + 5 (premium)) * 10 * 100 = 13000
    // put collateral (20% of 65 (stock price) - 0 (otm) + 1.5 (premium)) * 10 * 100 = 14500
    // result: 14500 (put collateral) + 5000 (call value) = 19500
    expect(collateral.toFixed()).toBe("19500");
  });
});

describe("calculateIronCondor", () => {
  it("returns put spread if it's larger", () => {
    const collateral = calculateIronCondor({
      contracts: [
        buildContract({
          position: Position.Long,
          optionType: OptionType.Put,
          strikePrice: 45,
          contractsCount: 3,
        }),
        buildContract({
          position: Position.Short,
          optionType: OptionType.Put,
          strikePrice: 50,
          contractsCount: 3,
        }),
        buildContract({
          position: Position.Short,
          optionType: OptionType.Call,
          strikePrice: 52,
          contractsCount: 3,
        }),
        buildContract({
          position: Position.Long,
          optionType: OptionType.Call,
          strikePrice: 55,
          contractsCount: 3,
        }),
      ],
      currentStockPrice: 0,
    });

    // put spread (50 (strike 1) - 45 (strike 2)) * 3 * 100 = 1500
    // call spread (55 (strike 1) - 52 (strike 2)) * 3 * 100 = 900
    expect(collateral).toBe(1500);
  });

  it("returns call spread if it's larger", () => {
    const collateral = calculateIronCondor({
      contracts: [
        buildContract({
          position: Position.Long,
          optionType: OptionType.Put,
          strikePrice: 45,
          contractsCount: 3,
        }),
        buildContract({
          position: Position.Short,
          optionType: OptionType.Put,
          strikePrice: 50,
          contractsCount: 3,
        }),
        buildContract({
          position: Position.Short,
          optionType: OptionType.Call,
          strikePrice: 52,
          contractsCount: 3,
        }),
        buildContract({
          position: Position.Long,
          optionType: OptionType.Call,
          strikePrice: 58,
          contractsCount: 3,
        }),
      ],
      currentStockPrice: 0,
    });

    // put spread (50 (strike 1) - 45 (strike 2)) * 3 * 100 = 1500
    // call spread (58 (strike 1) - 52 (strike 2)) * 3 * 100 = 1800
    expect(collateral).toBe(1800);
  });
});

describe("calculateShortCallButterfly", () => {
  it("returns spread of strike prices", () => {
    const collateral = calculateShortCallButterfly({
      contracts: [
        buildContract({
          position: Position.Short,
          optionType: OptionType.Call,
          strikePrice: 75,
          optionPrice: 1.5,
          contractsCount: 3,
        }),
        buildContract({
          position: Position.Long,
          optionType: OptionType.Call,
          strikePrice: 80,
          optionPrice: 4,
          contractsCount: 3,
        }),
        buildContract({
          position: Position.Long,
          optionType: OptionType.Call,
          strikePrice: 80,
          optionPrice: 4,
          contractsCount: 3,
        }),
        buildContract({
          position: Position.Short,
          optionType: OptionType.Put,
          strikePrice: 85,
          optionPrice: 6,
          contractsCount: 3,
        }),
      ],
      currentStockPrice: 100,
    });

    expect(collateral).toBe(1500);
  });
});
