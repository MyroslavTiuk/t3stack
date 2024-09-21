// @ts-nocheck

import { mergeDeepRight } from "ramda";

import position from "./position";
import { type PositionEstimate } from "opc-types/lib/PositionEstimate";
import { type StrategyComplete } from "opc-types/lib/Strategy";
import { testPartialStrategyLongCall } from "./helpers/testPartialStrategyLongCall";
import { testPartialStrategyCoveredCall } from "./helpers/testPartialStrategyCoveredCall";
import newYorkTime from "../../utils/Time/newYorkTime";

describe("services/calculate/position", () => {
  const testLongPutStrat = mergeDeepRight(testPartialStrategyLongCall, {
    legsById: { option: { opType: "put" } },
  });

  test("Calculates single option", () => {
    const expected: PositionEstimate = {
      gross: 199.83,
      legs: {
        option: {
          value: 1.9983,
        },
      },
    };
    const pos = { time: newYorkTime("2020-04-11 16:00:00"), price: 50 };

    const result: PositionEstimate = position(
      pos,
      testPartialStrategyLongCall as unknown as StrategyComplete
    );
    expect(result).toEqual(expected);
  });

  test("Calculates single option expiring worthless", () => {
    const expected: PositionEstimate = {
      gross: 0,
      legs: {
        option: {
          value: 0,
        },
      },
    };
    const pos = { time: newYorkTime("2020-04-25 16:00:00"), price: 49 };

    const result: PositionEstimate = position(
      pos,
      testPartialStrategyLongCall as unknown as StrategyComplete
    );

    expect(result).toEqual(expected);
  });

  test("Calculates single option expiring with intrinsic value", () => {
    const expected: PositionEstimate = {
      gross: 100,
      legs: {
        option: {
          value: 1,
        },
      },
    };
    const pos = { time: newYorkTime("2020-04-25 16:00:00"), price: 51 };

    const result: PositionEstimate = position(
      pos,
      testPartialStrategyLongCall as unknown as StrategyComplete
    );

    expect(result).toEqual(expected);
  });

  test("Calculates single option put", () => {
    const expected: PositionEstimate = {
      gross: 196.24,
      legs: {
        option: {
          value: 1.9624,
        },
      },
    };
    const pos = { time: newYorkTime("2020-04-11 16:00:00"), price: 50 };

    const result: PositionEstimate = position(
      pos,
      testLongPutStrat as unknown as StrategyComplete
    );

    expect(result).toEqual(expected);
  });

  test("Calculates single put expiring worthless", () => {
    const expected: PositionEstimate = {
      gross: 0,
      legs: {
        option: {
          value: 0,
        },
      },
    };
    const pos = { time: newYorkTime("2020-04-26"), price: 50 };

    const result: PositionEstimate = position(
      pos,
      testLongPutStrat as unknown as StrategyComplete
    );

    expect(result).toEqual(expected);
  });

  test("Calculates single put expiring with intrinsic value", () => {
    const expected: PositionEstimate = {
      gross: 100,
      legs: {
        option: {
          value: 1,
        },
      },
    };
    const pos = { time: newYorkTime("2020-04-25 16:00:00"), price: 49 };

    const result: PositionEstimate = position(
      pos,
      testLongPutStrat as unknown as StrategyComplete
    );

    expect(result).toEqual(expected);
  });

  test("Calculates cov call", () => {
    const expected: PositionEstimate = {
      gross: 5600 - 604.45,
      legs: {
        option: {
          value: 6.0445,
        },
        underlying: {
          value: 56,
        },
      },
    };
    const pos = { time: newYorkTime("2020-04-11 16:00:00"), price: 56 };

    const result: PositionEstimate = position(
      pos,
      testPartialStrategyCoveredCall as unknown as StrategyComplete
    );

    expect(result).toEqual(expected);
  });
});
