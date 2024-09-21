import * as Mx from "errable";
import * as R from "ramda";
import { type t } from "opc-types/lib";
import { type OptionsMontage, type postVars } from "./types";

import exchanges from "../../../../../../config/Exchanges";
import ENV from "../../../../../../config/Env";

import { cacher, cacherSave } from "../../../../cacher/cacher";
import {
  errorDataFactory,
  errorFactory,
} from "../../../../../infrastructure/errorHanding";
import { extractSingleValue } from "../../../../../../utils/String/strings";
import * as http from "../../../../http";

import { extractPostVars, addConstantPostVars } from "./postVars";
import { MESSAGES } from "../../../../../../consts";

export function getMonths(optResult: OptionsMontage): t.Outcome<string[]> {
  return Array.isArray(optResult.exp_Month_List)
    ? optResult.exp_Month_List.map(R.pathOr("", ["value"]))
    : errorFactory("Could not extract months from page", { severity: 2 });
}

export async function recoverWithCurrentMonth(
  symb: string,
  optResult: string
): Promise<t.Outcome<OptionsMontage>> {
  // todo**: save symb as bigmonth
  // const curMonth = new Date().getFullYear() + "" + (new Date().getMonth() + 1);

  return Promise.resolve(extractPostVars(optResult))
    .then(
      Mx.peekVal((postVars: postVars) => {
        cacherSave(
          {
            key: `cboe_postVars`,
            args: [symb],
            time: exchanges.TTL_META_DATA,
          },
          postVars
        );
        cacherSave(
          {
            key: `cboe_postVars_lastGood`,
            args: [symb],
            time: exchanges.TTL_LAST_GOOD_META,
          },
          postVars
        );
      })
    )
    .then(Mx.withNotErr((_) => addConstantPostVars(symb, _)))
    .then(
      Mx.ifNotErrAsync(
        (postVarData: postVars): Promise<t.Outcome<OptionsMontage>> => {
          return cacher(
            {
              key: `cboe_req`,
              time: exchanges.TTL_PRICE_DATA,
              args: [postVarData],
              shouldUse: R.always(ENV.USE_CACHE_REQ),
            },
            (postVarData_: postVars): Promise<t.Outcome<OptionsMontage>> => {
              return http
                .post<string>(
                  "http://www.cboe.com/delayedquote/quote-table",
                  postVarData_.toJS() as Record<string, string>
                )
                .then(
                  Mx.ifNotErr(
                    R.pipe(
                      (recResult: string) =>
                        extractSingleValue(
                          recResult,
                          /{"Option_Montage_List":(.*?)}}/
                        ),
                      (found: t.Optional<string[]>) =>
                        Mx.fromNull(
                          errorDataFactory(
                            "Could not extract options from recovering current month",
                            { code: 2 }
                          ),
                          found
                        )
                    )
                  )
                )
                .then(
                  Mx.cata(
                    R.pipe(
                      R.pathOr("{}", [0]),
                      (body: string) => `{"Option_Montage_List":${body}}}`,
                      JSON.parse
                    ),
                    (_) => errorFactory(MESSAGES.OPTIONS_NOT_FOUND)
                  )
                );
            }
          );
        }
      )
    );
}
