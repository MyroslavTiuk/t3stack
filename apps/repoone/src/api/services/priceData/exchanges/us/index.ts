import { type t } from "opc-types/lib";
import { type PriceData } from "opc-types/lib/PriceData";

import fixCommonSymbolMistakes from "./helpers/fixCommonSymbolMistakes";
import getCboePriceData from "./cboe-2020/getPriceCboe2020";
// import getYahooPriceData from './yahoo-api-v7';

export function getPriceData(
  symbol: string,
  month: t.Optional<string>
): Promise<t.Outcome<PriceData>> {
  // todo-future: fallback scrapers
  return getCboePriceData(fixCommonSymbolMistakes(symbol), month);
}
