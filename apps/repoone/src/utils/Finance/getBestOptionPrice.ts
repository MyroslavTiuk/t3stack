import { type OptionData } from "opc-types/lib/OptionData";
import { isNil } from "ramda";
import CentsMath from "../CentsMath/CentsMath";
import { isUndefined } from "errable";
import round from "../Data/round/round";

const ensureFloat = (x: number | string | undefined) =>
  x === undefined ? undefined : typeof x === "string" ? parseFloat(x) : x;

function getBestOptionPrice(
  priceSet: OptionData,
  act?: "buy" | "sell",
  atMarket = false
) {
  const bid = ensureFloat(priceSet.b) || 0;
  const last = ensureFloat(priceSet.l);
  const ask = ensureFloat(priceSet.a) || 0;
  const best =
    !isNil(bid) && (bid > 0 || ask <= 0.05) && !isNil(ask) && ask > 0
      ? atMarket && act === "buy"
        ? ask
        : atMarket && act === "sell"
        ? bid
        : (ask - bid) / bid < 0.25 || isUndefined(act)
        ? CentsMath.div(CentsMath.add(bid, ask), 2)
        : act === "buy"
        ? CentsMath.sub(ask, CentsMath.mult(bid, 0.125))
        : CentsMath.mult(bid, 1.125)
      : last;
  return best
    ? round(best, 2, { preferenceDownForHalf: act === "sell" })
    : best;
}

export default getBestOptionPrice;
