import { mergeDeepRight } from "ramda";

import getStrategyTitle from "./getStrategyTitle";
import { type Strategy } from "opc-types/lib/Strategy";

describe("utils/Finance/getStrategyTitle", () => {
  const strat = {
    title: "Long Call",
    metadata: {
      stratKey: "long-call",
    },
    underlyingElement: "underlying",
    legsById: {
      underlying: {
        val: "AAPL",
      },
      option: {
        type: "option",
        strike: 450,
        expiry: "20200825",
      },
    },
    legs: ["underlying", "option"],
  };

  test("25 Aug '20 450 Long Call", () => {
    const expected = "25 Aug '20 $450 Long Call";

    const result: string = getStrategyTitle(strat as unknown as Strategy);

    expect(result).toEqual(expected);
  });

  test("25 Aug 450/455 Call debit spread (bullish)", () => {
    const tStrat = mergeDeepRight(strat, {
      title: "Call debit spread (bullish)",
      metadata: { stratKey: "bullish-call-debit-spread" },
      legsById: {
        short: {
          type: "option",
          strike: 455,
          expiry: "20200825",
        },
      },
      legs: ["underlying", "option", "short"],
    });
    const expected = "25 Aug '20 $450/455 Call debit spread (bullish)";

    const result: string = getStrategyTitle(tStrat as unknown as Strategy);

    expect(result).toEqual(expected);
  });

  test("Cal spread", () => {
    const tStrat = mergeDeepRight(strat, {
      title: "Calendar spread",
      metadata: { stratKey: "calendar-spread" },
      legsById: {
        short: {
          type: "option",
          strike: 450,
          expiry: "20200822",
        },
      },
      legs: ["underlying", "option", "short"],
    });
    const expected = "25 Aug '20/22 Aug '20 $450 Calendar spread";

    const result: string = getStrategyTitle(tStrat as unknown as Strategy);

    expect(result).toEqual(expected);
  });
});
