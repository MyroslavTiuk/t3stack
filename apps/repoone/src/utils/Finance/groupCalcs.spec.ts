// @ts-nocheck

import groupCalcs from "./groupCalcs";

describe("groupCalcs", () => {
  const fix = [
    {
      id: "1",
      title: "400/420 8 Aug AAPL bullish call credit spread",
      symbol: "AAPL",
    },
    {
      id: "2",
      title: "410/420 8 Aug AAPL bullish call credit spread",
      symbol: "AAPL",
    },
    {
      id: "3",
      title: "400/430 8 Aug AAPL bullish call credit spread",
      symbol: "AAPL",
    },
    {
      id: "4",
      title: "410/440 8 Aug AAPL bullish call credit spread",
      symbol: "AAPL",
    },
    {
      id: "5",
      title: "400/450 8 Aug AAPL bullish call credit spread",
      symbol: "AAPL",
    },
    {
      id: "6",
      title: "800/820 8 Aug GOOG bullish call credit spread",
      symbol: "GOOG",
    },
    {
      id: "7",
      title: "810/820 8 Aug GOOG bullish call credit spread",
      symbol: "GOOG",
    },
  ];
  test("No maxRows", () => {
    const expected = {
      AAPL: [[fix[0]], [fix[1]], [fix[2]], [fix[3]], [fix[4]]],
      GOOG: [[fix[5]], [fix[6]]],
    };

    const actual = groupCalcs(fix);

    expect(actual).toEqual(expected);
  });
  test("4 maxRows", () => {
    const expected = {
      AAPL: [[fix[0], fix[4]], [fix[1]], [fix[2]], [fix[3]]],
      GOOG: [[fix[5]], [fix[6]]],
    };

    const actual = groupCalcs(fix, 4);

    expect(actual).toEqual(expected);
  });
});
