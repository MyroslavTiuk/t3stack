import { type t } from "opc-types/lib";
import { type Map } from "immutable";
import { cacher } from "../../../../cacher/cacher";
import exchanges from "../../../../../../config/Exchanges";
import R from "ramda";
import ENV from "../../../../../../config/Env";
import * as http from "../../../../http";

export async function makeDataReq(
  symb: string,
  month: t.Optional<string>,
  postVarData: Map<string, string>
): Promise<t.Outcome<string>> {
  return cacher(
    {
      key: `cboe_req`,
      time: exchanges.TTL_PRICE_DATA,
      args: [postVarData],
      shouldUse: R.always(ENV.USE_CACHE_REQ),
    },
    (postVarData_: Map<string, string>): Promise<t.Outcome<string>> => {
      return http.post(
        "http://www.cboe.com/delayedquote/quote-table",
        postVarData_.toJS() as Record<string, string>
      );
    }
  );
}
