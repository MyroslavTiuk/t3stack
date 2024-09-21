import adjustLegPricesFromSpreadPrice from "./adjustLegPricesFromSpreadPrice";

describe("pwa/store/reducers/helpers/adjustLegPricesFromSpreadPrice", () => {
  // const fixture = {};

  test("Debit spread", () => {
    const expected = {
      short: 3.375,
      long: 1.175,
    };

    const result = adjustLegPricesFromSpreadPrice(
      {
        short: {
          priceRange: [3.3, 3.6],
          act: "buy",
        },
        long: {
          priceRange: [1.1, 1.2],
          act: "sell",
        },
      },
      2.2,
      [2.1, 2.5]
    );

    expect(result).toEqual(expected);
  });

  test("Credit spread", () => {
    const expected = {
      short: 3.6,
      long: 1.1,
    };

    const result = adjustLegPricesFromSpreadPrice(
      {
        short: {
          priceRange: [3.3, 3.6],
          act: "sell",
        },
        long: {
          priceRange: [1.1, 1.2],
          act: "buy",
        },
      },
      -2.5,
      [-2.5, -2.1]
    );

    expect(result).toEqual(expected);
  });
});
