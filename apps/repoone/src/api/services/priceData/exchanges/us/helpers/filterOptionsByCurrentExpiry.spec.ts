import filterOptionsByCurrentExpiry from "./filterOptionsByCurrentExpiry";

describe("filterOptionsByCurrentExpiry", () => {
  const ops = {
    "2021-02-05": {},
    "2021-02-07": {},
    "2021-02-12": {},
  };
  const price = {
    options: ops,
  };

  test("All exps in future", () => {
    const expected = 3;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (partial)
    const newPriceData = filterOptionsByCurrentExpiry(price, "2021-02-04");
    const actual = Object.keys(newPriceData.options || {}).length;
    expect(actual).toEqual(expected);
  });
  test("An exp today", () => {
    const expected = 3;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (partial)
    const newPriceData = filterOptionsByCurrentExpiry(price, "2021-02-05");
    const actual = Object.keys(newPriceData.options || {}).length;
    expect(actual).toEqual(expected);
  });
  test("An exp yesterday", () => {
    const expected = 2;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (partial)
    const newPriceData = filterOptionsByCurrentExpiry(price, "2021-02-06");
    const actual = Object.keys(newPriceData.options || {}).length;
    expect(actual).toEqual(expected);
  });
});
