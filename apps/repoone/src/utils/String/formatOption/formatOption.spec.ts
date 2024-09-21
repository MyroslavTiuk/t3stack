import formatOption from "./formatOption";

describe("utils/String/formatOption/formatOption", () => {
  const testDate = new Date(2020, 1, 15);

  describe("year tests", () => {
    test("Near expiry", () => {
      const expected = "15th Mar $0.20 call";

      const result: string | null = formatOption(
        {
          strike: 0.2,
          expiry: "20200315",
          opType: "call",
        },
        testDate
      );

      expect(result).toEqual(expected);
    });

    test("Same year, far expiry", () => {
      const expected = "15th Dec $0.20 call";

      const result: string | null = formatOption(
        {
          strike: 0.2,
          expiry: "20201215",
          opType: "call",
        },
        testDate
      );

      expect(result).toEqual(expected);
    });

    test("Next year, far", () => {
      const expected = "15th Jan 21 $0.20 call";

      const result: string | null = formatOption(
        {
          strike: 0.2,
          expiry: "20210115",
          opType: "call",
        },
        testDate
      );

      expect(result).toEqual(expected);
    });

    test("Next year, within 90 days", () => {
      const testDateEOY = new Date(2020, 12, 15);
      const expected = "15th Jan $0.20 call";

      const result: string | null = formatOption(
        {
          strike: 0.2,
          expiry: "20210115",
          opType: "call",
        },
        testDateEOY
      );

      expect(result).toEqual(expected);
    });
  });

  describe("strike tests", () => {
    test("Strike of 7 omits cents", () => {
      const expected = "15th Mar $7 call";

      const result: string | null = formatOption({
        strike: 7,
        expiry: "20200315",
        opType: "call",
      });

      expect(result).toEqual(expected);
    });
    test("Strike of 7.6 adds cents 0", () => {
      const expected = "15th Mar $7.60 call";

      const result: string | null = formatOption({
        strike: 7.6,
        expiry: "20200315",
        opType: "call",
      });

      expect(result).toEqual(expected);
    });
    test("Less than $1 Is still in dollars", () => {
      const expected = "15th Mar $0.30 call";

      const result: string | null = formatOption({
        strike: 0.3,
        expiry: "20200315",
        opType: "call",
      });

      expect(result).toEqual(expected);
    });
  });
});
