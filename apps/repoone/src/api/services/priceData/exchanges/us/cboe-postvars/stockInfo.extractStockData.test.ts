import { type OptionsMontage } from "./types";

import { type StockData } from "opc-types/lib/StockData";
import { extractStockData } from "./stockInfo";
import { type t } from "opc-types/lib";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const wmtMontageNoBidAsk: OptionsMontage = require("./sample-response-short.json");

const wmtMontageWBidAsk: OptionsMontage = {
  ...wmtMontageNoBidAsk,
  quote_details: {
    ...wmtMontageNoBidAsk.quote_details,
    bid: 117.77,
    ask: 117.99,
  },
};

describe("services/priceData/exchanges/us/cboe-postvars/extractStockData", () => {
  test("Extracts stock data with no bid/ask as expected", () => {
    const expected: { last: number; ask: null; bid: null } = {
      bid: null,
      ask: null,
      last: 117.88,
    };
    const actual: t.Outcome<StockData> = extractStockData(wmtMontageNoBidAsk);

    expect(actual).toEqual(expected);
  });

  test("Extracts stock data as expected", () => {
    const expected: { last: number; ask: number; bid: number } = {
      bid: 117.77,
      ask: 117.99,
      last: 117.88,
    };
    const actual: t.Outcome<StockData> = extractStockData(wmtMontageWBidAsk);

    expect(actual).toEqual(expected);
  });
});
