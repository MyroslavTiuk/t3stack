import decodeOptionShortForm from "./decodeOptionShortForm";

describe("decodeOptionShortForm", () => {
  test("gets stock code", () => {
    const input = "wmt:20230519p125@3.50,2x20230519p125.50@3.70";
    const expected = "wmt";

    const output = decodeOptionShortForm(input);
    const actual = output.stock;

    expect(actual).toEqual(expected);
  });

  test("gets first position option, with no contract number", () => {
    const input = "wmt:20230519p125@3.50,2x20230519p125.50@3.70";
    const expected = {
      strike: 125,
      expiry: "20230519",
      opType: "put",
      price: 3.5,
      num: 1,
    };

    const output = decodeOptionShortForm(input);
    const actual = output.legs[0];

    expect(actual).toEqual(expected);
  });

  test("gets second position option, with specified contract number", () => {
    const input = "20230519p125@3.50,2x20230519p125.50@3.70";
    const expected = {
      strike: 125.5,
      expiry: "20230519",
      opType: "put",
      price: 3.7,
      num: 2,
    };

    const output = decodeOptionShortForm(input);
    const actual = output.legs[1];

    expect(actual).toEqual(expected);
  });

  test("gets buy act or sell", () => {
    const input = "b20230519p125@3.50,s2x20230519p125.50@3.70";
    const expected1 = "buy";
    const expected2 = "sell";

    const output = decodeOptionShortForm(input);
    const actual1 = output.legs[0]?.act;
    const actual2 = output.legs[1]?.act;

    expect(actual1).toEqual(expected1);
    expect(actual2).toEqual(expected2);
  })

  test("Can omit price", () => {
    const input = "b20230519p125";

    const output = decodeOptionShortForm(input);
    const actual = output.legs[0]?.price;

    expect(actual).toBeUndefined();
  })
});
