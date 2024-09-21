import forceArray from "./forceArray";

describe("utils/Data/forceArray", () => {
  test("Makes array from string", () => {
    const expected = ["str"];

    const result = forceArray("str");

    expect(result).toEqual(expected);
  });

  test("Keeps array from string", () => {
    const expected = ["str", "str2"];

    const result = forceArray(["str", "str2"]);

    expect(result).toEqual(expected);
  });
});
