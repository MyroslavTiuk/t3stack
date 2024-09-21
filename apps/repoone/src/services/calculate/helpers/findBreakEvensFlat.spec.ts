// @ts-nocheck

import findBreakEvensFlat from "./findBreakEvensFlat";
import { type PositionEstimateInitial } from "opc-types/lib/PositionEstimate";

describe("services/calculate/helpers/findBreakEvensFlat", () => {
  const fixInit = {
    gross: -5,
  } as PositionEstimateInitial;

  test("Long call-like", () => {
    const fixPrices = {
      0: 0,
      50: 0,
      70: 20,
    };
    const expected = [55];

    const result: number[] = findBreakEvensFlat(fixInit, fixPrices);

    expect(result).toEqual(expected);
  });
  test("Long put-like", () => {
    const fixPrices = {
      0: 50,
      50: 0,
      60: 0,
    };
    const expected = [45];

    const result: number[] = findBreakEvensFlat(fixInit, fixPrices);

    expect(result).toEqual(expected);
  });

  test("Bullish Spread-like", () => {
    const fixPrices = {
      0: 0,
      45: 0,
      55: 15,
      60: 15,
    };
    const expected = [48.33];

    const result: number[] = findBreakEvensFlat(fixInit, fixPrices);

    expect(result).toEqual(expected);
  });
});
