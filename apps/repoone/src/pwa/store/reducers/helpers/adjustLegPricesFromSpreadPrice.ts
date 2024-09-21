import { mapObjIndexed, isNil } from "ramda";

import { type Tuple } from "opc-types/lib/Tuple";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";

const adjustLegPricesFromSpreadPrice = (
  calc: ObjRecord<Pick<StratLegOpt, "priceRange" | "act">>,
  spreadPrice: number,
  spreadPriceRange: Tuple<number>
) => {
  const percOfSpread =
    (spreadPrice - Math.min(...spreadPriceRange)) /
    (Math.max(...spreadPriceRange) - Math.min(...spreadPriceRange));
  return mapObjIndexed((leg) => {
    if (isNil(leg?.priceRange[0]) || isNil(leg?.priceRange[1])) return null;
    const legPriceRange = leg?.priceRange as Tuple<number>;
    return leg?.act === "buy"
      ? Math.min(...legPriceRange) +
          (Math.max(...legPriceRange) - Math.min(...legPriceRange)) *
            percOfSpread
      : Math.max(...legPriceRange) -
          (Math.max(...legPriceRange) - Math.min(...legPriceRange)) *
            percOfSpread;
  }, calc);
};

export default adjustLegPricesFromSpreadPrice;
