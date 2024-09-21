import { type t } from "opc-types/lib";
import { type StockData } from "opc-types/lib/StockData";
import { type OptionsMontage } from "./types";

// const ifNotElse = <T, F>(val: T, checkVal: T, fallback: F) => val !== checkVal ? val : fallback;

export function extractStockData(data: OptionsMontage): t.Outcome<StockData> {
  return {
    last: data?.quote_details?.current_price || null,
    bid: data?.quote_details?.bid || null,
    ask: data?.quote_details?.ask || null,
    ivHist: data?.quote_details?.iv30 || null,
  };
}
