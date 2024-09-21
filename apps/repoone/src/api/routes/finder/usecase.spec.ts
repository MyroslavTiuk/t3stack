import { getOptionPrices } from "./helpers/getOptionPrices";
import mockOptionPrices from "./helpers/getOptionPrices.mocked-resolved-value";
import usecase from "./usecase";

jest.mock("./helpers/getOptionPrices");

describe("api/routes/finder/get/usecase", () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  getOptionPrices.mockResolvedValue(mockOptionPrices);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  test("TEMPORARY TEST", async (done) => {
    const expected = {};

    const result = await usecase({
      symbol: "wmt",
      currentPrice: 132.28,
      date: "2020-05-10",
      targetting: "single",
      priceFrom: 140,
      budgetExclExp: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sell: false,
    });

    expect(result).toEqual(expected);
    done();
  });
});
