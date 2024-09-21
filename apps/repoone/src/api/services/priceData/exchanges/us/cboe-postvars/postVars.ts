// import { Either, Maybe } from "async-monet";
import * as Mx from "errable";
import * as R from "ramda";
import { Map } from "immutable";
import { type t } from "opc-types/lib";
import { type postVars } from "./types";

import ENV from "../../../../../../config/Env";
import MESSAGES from "../../../../../../consts/MESSAGES";
import exchanges from "../../../../../../config/Exchanges";

import { errorDataFactory } from "../../../../../infrastructure/errorHanding";
import { fill } from "../../../../../../utils/Data/dataTransform/dataTransform";
import { extractSingleValues } from "../../../../../../utils/String/strings";
import { cacher, cacherRead, cacherSave } from "../../../../cacher/cacher";
import * as http from "../../../../http";
// import _ from "lodash";
// import _fp from "lodash/fp";

export function extractPostVars(
  quotePage: string
): t.Outcome<Map<string, string>> {
  const searches: Map<string, RegExp> = Map({
    __VIEWSTATE: /id="__VIEWSTATE" value="(.*?)"/g,
    __VIEWSTATEGENERATOR: /id="__VIEWSTATEGENERATOR" value="(.*?)"/g,
    __EVENTVALIDATION: /id="__EVENTVALIDATION" value="(.*?)"/g,
    // "__EVENTTARGET": /id="__EVENTTARGET" value="(.*?)"/g,
    // "__EVENTARGUMENT": /id="__EVENTARGUMENT" value="(.*?)"/g,
  });

  return R.pipe(
    R.always(
      Mx.fromNull(
        errorDataFactory("Could not extract postvars"),
        extractSingleValues(quotePage, searches)
      )
    ),
    Mx.withNotErr(
      (results: Map<string, string[]>): Map<string, string> =>
        <Map<string, string>>results.map((x) => x[0] || "")
    )
  )();
}

export function addConstantPostVars(
  symb: string,

  postVars: Map<string, string>
): Map<string, string> {
  // EXPERIMENTAL:
  const ASK_FOR_MONTH = ""; // cfg.month;

  const basePostVars = postVars
    .set("ctl00$ContentTop$C002$txtSymbol", symb)
    .set("ctl00$ContentTop$C002$ALL", "2")
    .set("ctl00$ctl05", "")
    .set("SearchQuery", "")
    .set("ticker", "")
    .set("__EVENTTARGET", "")
    .set("__EVENTARGUMENT", "");
  if (ASK_FOR_MONTH !== undefined) {
    return (
      basePostVars
        .set("ctl00$ContentTop$C002$ddlMonth", ASK_FOR_MONTH)
        // .set("ctl00$ContentTop$C002$ddlExchange", "CBOE")
        .set("ctl00$ContentTop$C002$btnFilter", "View Chain")
        // .set("month", "")
        .set("ddlVolume", "-1")
        .set("ddlRange", "All")
        .set("ddlClass", "")
        .set("__CALLBACKID", "ctl00$ContentTop$C002")
        .set("__CALLBACKPARAM", `${symb}|${ASK_FOR_MONTH}|all`)
        .remove("ctl00$ContentTop$C002$btnSubmit")
    );
  }
  return basePostVars.set("ctl00$ContentTop$C002$btnSubmit", "Submit");
}

const defaultPostVarsCacherParams: t.CacherParams<[string]> = {
  key: `cboe_postVars_default`,
  time: exchanges.TTL_META_DATA,
  shouldSave: (result: t.Outcome<postVars>): boolean => {
    // On save, if found, save this as lastGood.
    Mx.peekVal((resultVal: Map<string, string>) => {
      cacherSave(
        {
          key: `cboe_postVars_lastGood_default`,
          time: exchanges.TTL_LAST_GOOD_META,
        },
        resultVal
      );
    }, result);
    return Mx.isVal(result);
  },
  shouldUse: R.always(ENV.USE_CACHE_REQ),
};

export function getMonthPostVars(
  symb: string
  // month: string
): Promise<t.Outcome<postVars>> {
  return cacher(
    fill(
      {
        key: `cboe_postVars`,
        args: [symb],
        shouldSave: (result: t.Outcome<postVars>): boolean => {
          // On save, if found, save this as lastGood.
          Mx.peekVal((resultVal: Map<string, string>) => {
            cacherSave(
              {
                key: `cboe_postVars_lastGood`,
                args: [symb],
                time: exchanges.TTL_LAST_GOOD_META,
              },
              resultVal
            );
          }, result);
          return Mx.isVal(result);
        },
      },
      defaultPostVarsCacherParams
    ),
    (symb_: string): Promise<t.Outcome<postVars>> => {
      return getDefaultPostVars(symb_)
        .then(
          Mx.ifNotErrAsync(
            (_: postVars): Promise<t.Outcome<string>> =>
              http.post(
                "http://www.cboe.com/delayedquote/quote-table",
                _.toJS() as Record<string, string>
              )
          )
        )
        .then(
          Mx.withErr(
            R.always(
              errorDataFactory(MESSAGES.CBOE_COULD_NOT_ACCESS_QUOTE_ENDPOINT)
            )
          )
        )
        .then(Mx.ifNotErr(extractPostVars));

      // .then_Mx.withErrAsync((err: string): t.AppError => errorFactory(
      //   MESSAGES.CBOE_COULD_NOT_ACCESS_QUOTE_ENDPOINT
      // ))
      // .then_Mx.ifNotErrAsync(extractPostVars);
    }
  )
    .then(Mx.withNotErr((_: postVars) => addConstantPostVars(symb, _)))
    .then(
      Mx.ifErrAsync(async (err: t.ErrorData) => {
        // if postVars weren't available, use the lastGood ones
        const lastGood = <t.Optional<postVars>>await cacherRead({
          key: `cboe_postVars_lastGood`,
          args: [symb],
        });
        return Mx.fromNull(err, lastGood);
      })
    );
}

export function getDefaultPostVars(symb: string): Promise<t.Outcome<postVars>> {
  return cacher(
    defaultPostVarsCacherParams,
    (_x: string): Promise<t.Outcome<postVars>> => {
      return http
        .get<string>("http://www.cboe.com/delayedquote/quote-table")
        .then(Mx.ifNotErr(extractPostVars))
        .then(
          Mx.withErr(
            (_): t.ErrorData =>
              errorDataFactory(MESSAGES.CBOE_COULD_NOT_ACCESS_QUOTE_ENDPOINT)
          )
        );
    }
  )
    .then(Mx.withNotErr((x) => addConstantPostVars(symb, x)))
    .then(
      Mx.ifErrAsync(async (err: t.ErrorData): Promise<t.Outcome<postVars>> => {
        // if defaultPostVars weren't available, use the lastGood ones
        const lastGood = <t.Optional<postVars>>await cacherRead({
          key: `cboe_postVars_lastGood_default`,
        });
        return Mx.fromNull(err, lastGood);
      })
    );
}

export function getPostVars(
  symb: string,
  month: t.Optional<string>
): Promise<t.Outcome<postVars>> {
  return Promise.resolve(month)
    .then((monthVal) => Mx.fromNull(undefined, monthVal))
    .then(
      Mx.cata(
        (monthCode: string) => getMonthPostVars(monthCode),
        (_: undefined) => getDefaultPostVars(symb)
      )
    );
}
