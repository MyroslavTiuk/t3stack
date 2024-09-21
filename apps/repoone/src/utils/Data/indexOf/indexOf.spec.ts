import indexOf from "./indexOf";
import { type Nullable } from "errable";

describe("utils/Data/indexOf/indexOf", () => {
  const fixture = ["a", "b", "c"];

  test("Finds index", () => {
    const expected = 1;

    const result: Nullable<number> = indexOf("b", fixture);

    expect(result).toEqual(expected);
  });

  test("Finds index curried", () => {
    const expected = 1;

    const result: Nullable<number> = indexOf("b")(fixture);

    expect(result).toEqual(expected);
  });

  test("Returns null", () => {
    const expected = null;

    const result: Nullable<number> = indexOf("x", fixture);

    expect(result).toEqual(expected);
  });

  test("Returns null curried", () => {
    const expected = null;

    const result: Nullable<number> = indexOf("x")(fixture);

    expect(result).toEqual(expected);
  });
});
