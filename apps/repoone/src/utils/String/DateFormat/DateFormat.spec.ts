import * as DateFormat from "./DateFormat";

describe("utils/String/DateFormat/DateFormat", () => {
  describe("codeToExp", () => {
    test("Feb 1 1998", () => {
      const fix = "19980201";
      const expected = "1 Feb 1998";

      const result: string = DateFormat.codeToExp(fix);

      expect(result).toEqual(expected);
    });
    test("Nov 28 2005", () => {
      const fix = "20051128";
      const expected = "28 Nov 2005";

      const result: string = DateFormat.codeToExp(fix);

      expect(result).toEqual(expected);
    });
    test("Dec 30 2025", () => {
      const fix = "20251230";
      const expected = "30 Dec 2025";

      const result: string = DateFormat.codeToExp(fix);

      expect(result).toEqual(expected);
    });
  });

  describe("expToCode, from short year", () => {
    test("Feb 1 1998", () => {
      const fix = "1 Feb 98";
      const expected = "19980201";

      const result: string = DateFormat.expToCode(fix);

      expect(result).toEqual(expected);
    });
    test("Nov 28 2005", () => {
      const fix = "28 Nov 05";
      const expected = "20051128";

      const result: string = DateFormat.expToCode(fix);

      expect(result).toEqual(expected);
    });
    test("Dec 30 2025", () => {
      const fix = "30 Dec 25";
      const expected = "20251230";

      const result: string = DateFormat.expToCode(fix);

      expect(result).toEqual(expected);
    });
  });

  describe("expToCode", () => {
    test("Feb 1 1998", () => {
      const fix = "1 Feb 1998";
      const expected = "19980201";

      const result: string = DateFormat.expToCode(fix);

      expect(result).toEqual(expected);
    });
    test("Nov 28 2005", () => {
      const fix = "28 Nov 2005";
      const expected = "20051128";

      const result: string = DateFormat.expToCode(fix);

      expect(result).toEqual(expected);
    });
    test("Dec 30 2025", () => {
      const fix = "30 Dec 2025";
      const expected = "20251230";

      const result: string = DateFormat.expToCode(fix);

      expect(result).toEqual(expected);
    });
  });

  describe("validateDate", () => {
    test("validates correct date", () => {
      const fix = "20251215";
      const expected = fix;

      const result = DateFormat.validateDate(fix);

      expect(result).toBe(expected);
    });

    test("fixes misformatted date", () => {
      const fix = "2025-12-15";
      const expected = "20251215";

      const result = DateFormat.validateDate(fix);

      expect(result).toBe(expected);
    });

    test("fixes misformatted date", () => {
      const fix = "2025/12/15";
      const expected = "20251215";

      const result = DateFormat.validateDate(fix);

      expect(result).toBe(expected);
    });

    test("fixes misformatted date", () => {
      const fix = "15/12/2025";
      const expected = "20251215";

      const result = DateFormat.validateDate(fix);

      expect(result).toBe(expected);
    });

    test("fixes misformatted date", () => {
      const fix = "15-12-2025";
      const expected = "20251215";

      const result = DateFormat.validateDate(fix);

      expect(result).toBe(expected);
    });

    test("fails date where month/day is swapped", () => {
      const fix = "20251512";
      const expected = false;

      const result = DateFormat.validateDate(fix);

      expect(result).toBe(expected);
    });

    test("fails date where month/day is swapped, with extra separating characters", () => {
      const fix = "2025-15-12";
      const expected = false;

      const result = DateFormat.validateDate(fix);

      expect(result).toBe(expected);
    });

    test("fails date with rubbish text", () => {
      const fix = "abcdefgh";
      const expected = false;

      const result = DateFormat.validateDate(fix);

      expect(result).toBe(expected);
    });

    test("fails date that's empty", () => {
      const fix = "";
      const expected = false;

      const result = DateFormat.validateDate(fix);

      expect(result).toBe(expected);
    });
  });
});
