import { type Nullable } from "opc-types/lib/util/Nullable";

import { getOuterStrike, OUTER_OPTS } from ".";
import { type StrategyComplete } from "opc-types/lib/Strategy";
import { type StratLegOptComplete } from "opc-types/lib/StratLegOpt";

describe("services/calculate/theoPositions/getOuterStrike", () => {
  const fixture = {
    legsById: {
      short: {
        strike: 100,
        type: "option",
      } as StratLegOptComplete,
      long: {
        strike: 120,
        type: "option",
      } as StratLegOptComplete,
    },
    legs: ["short", "long"],
  };

  test("Finds min", () => {
    const expected = 100;

    const result: Nullable<number> = getOuterStrike(
      fixture as unknown as StrategyComplete,
      OUTER_OPTS.MIN
    );

    expect(result).toEqual(expected);
  });
});
