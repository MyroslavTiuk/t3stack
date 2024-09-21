import axios from "axios";
import { ifNotErr } from "errable";

import { type PriceData } from "opc-types/lib/PriceData";
import { type Outcome } from "opc-types/lib/Outcome";

import getPriceUsecase from "../../price/usecase";

import { SITE } from "~/config/Site";
import { getExchange } from "~/utils/Finance/market/market";
import { MARKET_MAP } from "../../../../consts";
import { convertExpiryAddDashes } from "~/utils/Time/convertExpiry";

export function getOptionPrices(
  symb: string
  // opts = {}
): Promise<Outcome<PriceData>> {
  if (getExchange(symb) === MARKET_MAP.to) {
    return getPriceUsecase({ symbol: symb, force: false }).then(
      ifNotErr((data) => {
        if (!data.options) return data;
        return {
          ...data,
          options: Object.fromEntries(
            Object.entries(data?.options || {})
              .map(
                ([exp, vals]) => [convertExpiryAddDashes(exp), vals] as const
              )
              .sort((a, b) => (a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0))
          ),
        };
      })
    ) as Promise<Outcome<PriceData>>;
  }
  return axios(`${SITE.V2_API_URL}/getOptions?stock=${symb}&reqId=0`) // && opts.date
    .then((b) => b.data);
}
