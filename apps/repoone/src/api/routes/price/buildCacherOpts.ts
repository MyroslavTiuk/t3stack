import { type t } from "opc-types/lib";
import { type PriceData } from "opc-types/lib/PriceData";
import * as Mx from "errable";
import EXCHANGES from "../../../config/Exchanges";

type Params = {
  fullSymbol: string;
  month: t.Optional<string>;
  shouldUse: () => boolean;
  onSave?: (v: t.Outcome<t.PriceData>) => any;
};

const buildCacherOpts = (
  p: Params
): t.CacherParams<[string, t.Optional<string>, number]> => ({
  key: `getPriceRoute_${p.fullSymbol}${p.month || ""}`,
  time: EXCHANGES.TTL_PRICE_DATA,
  args: [p.fullSymbol, p.month, EXCHANGES.TTL_PRICE_DATA],
  shouldUse: p.shouldUse,
  // todo!
  //  - If successful, save, if not successful, depends on error (if no symbol, then might as well save it, if dud options, then retry)
  shouldSave: (result: t.Outcome<PriceData>) => {
    if (typeof p.onSave === "function") p.onSave(result);
    return Mx.isVal(result);
  },
});

export default buildCacherOpts;
