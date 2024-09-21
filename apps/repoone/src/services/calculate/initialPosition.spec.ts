import initialPosition from "./initialPosition";
import { type PositionEstimateInitial } from "opc-types/lib/PositionEstimate";
import { type StrategyComplete } from "opc-types/lib/Strategy";
import { testPartialStrategyLongCall } from "./helpers/testPartialStrategyLongCall";
import { testPartialStrategyCoveredCall } from "./helpers/testPartialStrategyCoveredCall";

describe("services/calculate/initialPosition", () => {
  test("Calculates single option", () => {
    const expected: PositionEstimateInitial = {
      gross: -200,
      contractsPerShare: 100,
      legs: {
        option: {
          value: 2,
          act: "buy",
          num: 1,
        },
      },
    };

    // @ts-ignore
    const result: PositionEstimateInitial = initialPosition(
      testPartialStrategyLongCall as unknown as StrategyComplete
    );

    expect(result).toEqual(expected);
  });
  test("Calculates cov call", () => {
    const expected: PositionEstimateInitial = {
      gross: -5200 + 233,
      contractsPerShare: 100,
      legs: {
        option: {
          value: 2.33,
          act: "sell",
          num: 1,
        },
        underlying: {
          value: 52,
          act: "buy",
          num: 100,
        },
      },
    };

    // @ts-ignore
    const result: PositionEstimateInitial = initialPosition(
      testPartialStrategyCoveredCall as unknown as StrategyComplete
    );

    expect(result).toEqual(expected);
  });
});
