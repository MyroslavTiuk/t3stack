import { adjustNum, DISP_POSITIVE_MINIMUM } from "./adjustNum";

describe("adjustNum", () => {
  const fixLimitSmall = [-1, 0.1] as [number, number];
  const fixLimitLessThan100 = [-1, 0.9] as [number, number];
  const fixLimitMoreThan100 = [-1, 1.5] as [number, number];
  const fixLimitMoreThan200 = [-1, 3] as [number, number];

  describe("Small return", () => {
    test("Max loss", () => {
      const expected = -1;

      const actual = adjustNum(-1, fixLimitSmall);

      expect(actual).toEqual(expected);
    });
    test("Half return", () => {
      const expected = DISP_POSITIVE_MINIMUM / 2;

      const actual = adjustNum(0.05, fixLimitSmall);

      expect(actual).toEqual(expected);
    });
    test("Full return", () => {
      const expected = DISP_POSITIVE_MINIMUM;

      const actual = adjustNum(0.1, fixLimitSmall);

      expect(actual).toEqual(expected);
    });
  });
  describe("Less than 100 return", () => {
    test("Max loss", () => {
      const expected = -1;

      const actual = adjustNum(-1, fixLimitLessThan100);

      expect(actual).toEqual(expected);
    });
    test("Half return", () => {
      const expected = 0.45;

      const actual = adjustNum(0.45, fixLimitLessThan100);

      expect(actual).toEqual(expected);
    });
    test("Full return", () => {
      const expected = 0.9;

      const actual = adjustNum(0.9, fixLimitLessThan100);

      expect(actual).toEqual(expected);
    });
  });
  describe("More than 100 return", () => {
    test("Max loss", () => {
      const expected = -1;

      const actual = adjustNum(-1, fixLimitMoreThan100);

      expect(actual).toEqual(expected);
    });
    test("50%", () => {
      const expected = 0.5;

      const actual = adjustNum(0.5, fixLimitMoreThan100);

      expect(actual).toEqual(expected);
    });
    test("100%", () => {
      const expected = 1;

      const actual = adjustNum(1, fixLimitMoreThan100);

      expect(actual).toEqual(expected);
    });
    test("150%", () => {
      const expected = 1.5;

      const actual = adjustNum(1.5, fixLimitMoreThan100);

      expect(actual).toEqual(expected);
    });
  });
  describe("More than 200 return", () => {
    test("Max loss", () => {
      const expected = -1;

      const actual = adjustNum(-1, fixLimitMoreThan200);

      expect(actual).toEqual(expected);
    });
    test("50%", () => {
      const expected = 0.5;

      const actual = adjustNum(0.5, fixLimitMoreThan200);

      expect(actual).toEqual(expected);
    });
    test("100%", () => {
      const expected = 1;

      const actual = adjustNum(1, fixLimitMoreThan200);

      expect(actual).toEqual(expected);
    });
    test("150%", () => {
      const expected = 1.25;

      const actual = adjustNum(1.5, fixLimitMoreThan200);

      expect(actual).toEqual(expected);
    });
    test("250%", () => {
      const expected = 1.75;

      const actual = adjustNum(2.5, fixLimitMoreThan200);

      expect(actual).toEqual(expected);
    });
    test("300%", () => {
      const expected = 2;

      const actual = adjustNum(3, fixLimitMoreThan200);

      expect(actual).toEqual(expected);
    });
  });
});
