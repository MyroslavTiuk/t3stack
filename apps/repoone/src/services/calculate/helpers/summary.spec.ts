import { mergeDeepRight } from "ramda";
import { type StrategyComplete } from "opc-types/lib/Strategy";
import { type PositionEstimateInitial } from "opc-types/lib/PositionEstimate";
import { testPartialStrategyLongCall } from "./testPartialStrategyLongCall";
import initialPosition from "../initialPosition";
import summary from "./summary";

describe("services/calculate/summary", () => {
  const fixInit: PositionEstimateInitial = initialPosition(
    testPartialStrategyLongCall as unknown as StrategyComplete,
    { stockChangeInValue: true }
  );
  const fixTheoPts = {};
  const fixMeta = {
    curVol: 20,
    maxCalcDate: "2020-04-25",
  };

  test("Long call returns strike and cost as max risk", () => {
    const expected = {
      maxReturn: Infinity,
      maxRisk: 200,
      maxRisk1SD: 200,
      maxRisk2SD: 200,
    };

    const result: any = summary(
      testPartialStrategyLongCall as unknown as StrategyComplete,
      fixInit,
      fixTheoPts,
      // @ts-ignore
      fixMeta
    );

    expect(result).toEqual(expected);
  });

  test("Long call returns strike and cost as max risk, accounting for SD ", () => {
    const expected = {
      maxReturn: Infinity,
      maxRisk: 200,
      maxRisk1SD: 0,
      maxRisk2SD: 191.69,
    };

    const testLongCallITM = mergeDeepRight(testPartialStrategyLongCall, {
      legsById: { option: { strike: 46 } },
    });

    const result: any = summary(
      testLongCallITM as unknown as StrategyComplete,
      fixInit,
      fixTheoPts,
      // @ts-ignore
      fixMeta
    );

    expect(result).toEqual(expected);
  });

  test("Short call returns infinite risk", () => {
    const expected = {
      maxReturn: 200,
      maxRisk: Infinity,
      maxRisk1SD: 0,
      maxRisk2SD: 191.69,
    };

    const testShortCall = mergeDeepRight(testPartialStrategyLongCall, {
      legsById: {
        option: {
          act: "sell",
        },
      },
    });

    const result: any = summary(
      testShortCall as unknown as StrategyComplete,
      // @ts-ignore
      initialPosition(testShortCall as unknown as StrategyComplete),
      fixTheoPts,
      // @ts-ignore
      fixMeta
    );

    expect(result).toEqual(expected);
  });
});
