import xor from "./xor";

describe("utils/Data/xor/xor", () => {
  // const fixture = {};

  test("true on or", () => {
    const expected = true;

    const result: boolean = xor(true, false);

    expect(result).toEqual(expected);
  });
  test("false on double false", () => {
    const expected = false;

    const result: boolean = xor(false, false);

    expect(result).toEqual(expected);
  });
  test("false on double true", () => {
    const expected = false;

    const result: boolean = xor(true, true);

    expect(result).toEqual(expected);
  });
});
