import { type OptionData } from "opc-types/lib/OptionData";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { isNil } from "ramda";

const ensureFloat = (x: number | string | undefined) =>
  x === undefined ? undefined : typeof x === "string" ? parseFloat(x) : x;

function getBestOptionPriceRange(
  priceSet: OptionData,
  _?: "buy" | "sell"
): [Nullable<number>, Nullable<number>] {
  const bid = ensureFloat(priceSet.b);
  const last = ensureFloat(priceSet.l);
  const ask = ensureFloat(priceSet.a);
  return !isNil(bid) && bid > 0 && !isNil(ask) && ask > 0
    ? [bid, ask]
    : !isNil(bid)
    ? [bid, Math.max(last || 0, bid)]
    : !isNil(ask)
    ? [Math.min(last || Infinity, ask), ask]
    : !isNil(last)
    ? [last, last]
    : [null, null];
}

export default getBestOptionPriceRange;
