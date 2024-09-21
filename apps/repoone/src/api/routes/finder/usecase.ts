import { identity, map, lensPath, over } from "ramda";
import { ifVal } from "errable";

import { type ReturnType, type DTO } from "./types";
import { type Outcome } from "opc-types/lib/Outcome";
import get_relevant_strats from "./helpers/getRelevantStrats";
import get_pricing from "./helpers/getPricing";
import getStratOutcomes from "./helpers/getStratOutcomes";
import transformStrategyForV2 from "./helpers/transformStrategyForV2";
import sortOutcomes from "./helpers/sortOutcomes";

const varsLens = lensPath(["vars", "strat", "legsById"]);

const finderGetUsecase = async (dto: DTO): Promise<Outcome<ReturnType>> => {
  const start = Date.now();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Promise.resolve(dto)
    .then(get_relevant_strats)
    .then(async (relevantStrats) => ({
      priceInfo: await get_pricing(dto, relevantStrats),
      relevantStrats,
    }))
    .then(({ relevantStrats, priceInfo }) =>
      getStratOutcomes(dto, priceInfo, relevantStrats)
    )
    .then(sortOutcomes(dto.sortBy))
    .then((o) => o.slice(0, 5))
    .then(
      dto.dataFormat === "v2"
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          map(over(varsLens, transformStrategyForV2))
        : identity
    )
    .then(ifVal((outcomes) => ({ outcomes, runLength: Date.now() - start })));
};

export default finderGetUsecase;
