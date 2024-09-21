import { mergeDeepRight } from "ramda";
import { type Nullable } from "errable";

import { testPartialStrategyLongCall } from "../../services/calculate/helpers/testPartialStrategyLongCall";
import { type StrategyComplete } from "opc-types/lib/Strategy";

import getCollateral from "./getCollateral";

const getStrat = (stateData: any) =>
  mergeDeepRight(testPartialStrategyLongCall, stateData);

/**
 * Test examples are drawn from https://www.cboe.com/learncenter/pdf/margin2-00.pdf
 */
describe("utils/Finance/getMargin", () => {
  test("OTM short call", () => {
    const fixture = getStrat({
      stratKey: "short-call",
      legsById: {
        underlying: {
          price: 17.25,
        },
        option: {
          price: 0.0625,
          strike: 30,
          act: "sell",
        },
      },
    }) as unknown as StrategyComplete;
    expect(fixture.legsById.option.price).toEqual(0.0625);

    const expected = -Math.max(6.25 + 1725 * 0.2 - (3000 - 1725), 6.25 + 172.5);

    const result: Nullable<number> = getCollateral(fixture);

    expect(result).toEqual(expected);
  });

  test("ITM short call", () => {
    const fixture = getStrat({
      stratKey: "short-call",
      legsById: {
        underlying: {
          price: 128.5,
        },
        option: {
          price: 8.375,
          strike: 120,
          act: "sell",
        },
      },
    }) as unknown as StrategyComplete;

    const expected = -Math.max(837.5 + 12850 * 0.2, 837.5 + 1285);

    const result: Nullable<number> = getCollateral(fixture);

    expect(result).toEqual(expected);
  });

  test("OTM short put", () => {
    const fixture = getStrat({
      stratKey: "short-put",
      legsById: {
        underlying: {
          price: 95,
        },
        option: {
          price: 2,
          strike: 80,
          act: "sell",
          opType: "put",
        },
      },
    }) as unknown as StrategyComplete;

    const expected = -Math.max(200 + 9500 * 0.2 - (9500 - 8000), 200 + 800);

    const result: Nullable<number> = getCollateral(fixture);

    expect(result).toEqual(expected);
  });

  test("ITM short call index", () => {
    const fixture = getStrat({
      stratKey: "short-call",
      legsById: {
        underlying: {
          price: 433.35,
          val: "spx",
        },
        option: {
          price: 8.75,
          strike: 430,
          act: "sell",
        },
      },
    }) as unknown as StrategyComplete;

    const expected = -7375.25;

    const result: Nullable<number> = getCollateral(fixture);

    expect(result).toEqual(expected);
  });

  test("OTM short put index", () => {
    const fixture = getStrat({
      stratKey: "short-put",
      legsById: {
        underlying: {
          price: 445.35,
          val: "spx",
        },
        option: {
          price: 0.125,
          strike: 410,
          act: "sell",
          opType: "put",
        },
      },
    }) as unknown as StrategyComplete;

    const expected = -4112.5;

    const result: Nullable<number> = getCollateral(fixture);

    expect(result).toEqual(expected);
  });

  test("ITM short put index", () => {
    const fixture = getStrat({
      stratKey: "short-put",
      legsById: {
        underlying: {
          price: 433.35,
          val: "spx",
        },
        option: {
          price: 7.875,
          strike: 430,
          act: "put",
        },
      },
    }) as unknown as StrategyComplete;

    const expected = -6952.75;

    const result: Nullable<number> = getCollateral(fixture);

    expect(result).toEqual(expected);
  });

  test("OTM WMT put example", () => {
    const fixture = getStrat({
      stratKey: "short-put",
      legsById: {
        underlying: {
          price: 126.95,
          val: "wmt",
        },
        option: {
          price: 14,
          strike: 135,
          act: "put",
        },
      },
    }) as unknown as StrategyComplete;

    const expected = -2539 - 1400;

    const result: Nullable<number> = getCollateral(fixture);

    expect(result).toEqual(expected);
  });
});
