import formatDisplayValue from "./formatDisplayValue";

describe("utils/String/formatDisplayValue/formatDisplayValue", () => {
  test("999 : 999", () => {
    const expected = "999";
    const fix = 999;

    const result: string = formatDisplayValue(fix);

    expect(result).toEqual(expected);
  });
  test("-999 : -999", () => {
    const expected = "-999";
    const fix = -999;

    const result: string = formatDisplayValue(fix);

    expect(result).toEqual(expected);
  });
  test("1050 : 1050", () => {
    const expected = "1050";
    const fix = 1050;

    const result: string = formatDisplayValue(fix);

    expect(result).toEqual(expected);
  });
  test("-1050 : -1050", () => {
    const expected = "-1050";
    const fix = -1050;

    const result: string = formatDisplayValue(fix);

    expect(result).toEqual(expected);
  });
  test("10500 : 10.5k", () => {
    const expected = "10.5k";
    const fix = 10500;

    const result: string = formatDisplayValue(fix);

    expect(result).toEqual(expected);
  });
  test("-10500 : -10.5k", () => {
    const expected = "-10.5k";
    const fix = -10500;

    const result: string = formatDisplayValue(fix);

    expect(result).toEqual(expected);
  });
  test("50 : 50.0", () => {
    const expected = "50.0";
    const fix = 50;

    const result: string = formatDisplayValue(fix);

    expect(result).toEqual(expected);
  });
  test("50.76 : 50.8", () => {
    const expected = "50.8";
    const fix = 50.76;

    const result: string = formatDisplayValue(fix);

    expect(result).toEqual(expected);
  });
  test("-50.76 : -51", () => {
    const expected = "-51";
    const fix = -50.76;

    const result: string = formatDisplayValue(fix);

    expect(result).toEqual(expected);
  });
  test("5.07 : 5.07", () => {
    const expected = "5.07";
    const fix = 5.07;

    const result: string = formatDisplayValue(fix);

    expect(result).toEqual(expected);
  });
  test("-5.07 : -5.1", () => {
    const expected = "-5.1";
    const fix = -5.07;

    const result: string = formatDisplayValue(fix);

    expect(result).toEqual(expected);
  });
});
