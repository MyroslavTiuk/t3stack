import CentsMath from "./CentsMath";

describe("utils/CentsMath/CentsMath", () => {
  test("Can add 10c and 20c", () => {
    const expected = 0.3;

    const result: number = CentsMath.add(0.1, 0.2);

    expect(result).toEqual(expected);
  });
  test("Can sub 30c and 10c", () => {
    const expected = 0.2;

    const result: number = CentsMath.sub(0.3, 0.1);

    expect(result).toEqual(expected);
  });
  test("Can mult 20c and 10c", () => {
    const expected = 0.02;

    const result: number = CentsMath.mult(0.2, 0.1);

    expect(result).toEqual(expected);
  });
  test("Can div 20c and 10c", () => {
    const expected = 0.2;

    const result: number = CentsMath.div(0.02, 0.1);

    expect(result).toEqual(expected);
  });
  test("Can mult $2 and .10", () => {
    const expected = 0.2;

    const result: number = CentsMath.mult(2, 0.1);

    expect(result).toEqual(expected);
  });
  test("Can mult $2 and 10", () => {
    const expected = 20;

    const result: number = CentsMath.mult(2, 10);

    expect(result).toEqual(expected);
  });
  test("Can div 20c and 10", () => {
    const expected = 0.002;

    const result: number = CentsMath.div(0.02, 10);

    expect(result).toEqual(expected);
  });
  test("Can div 7.25 by 2", () => {
    const expected = 3.625;

    const result: number = CentsMath.div(7.25, 2);

    expect(result).toEqual(expected);
  });
});
