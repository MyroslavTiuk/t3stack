import { type OptionsChain_types } from "opc-types/lib/OptionsChain";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { pipe, sort, uniq } from "ramda";

import opTypeKey from "../../../../../../utils/String/opTypeKey/opTypeKey";

const getStrikesFromChain = (
  prices: OptionsChain_types
): Nullable<number[]> => {
  return pipe(
    () =>
      Object.keys(prices[opTypeKey.CALL] || [])
        .map((k) => parseFloat(k))
        .concat(
          Object.keys(prices[opTypeKey.PUT] || []).map((k) => parseFloat(k))
        ),
    uniq,
    sort((a, b) => a - b)
  )();
};

export default getStrikesFromChain;
