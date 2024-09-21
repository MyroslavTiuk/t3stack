import * as Mx from "errable";
import { type t } from "opc-types/lib";
import { getPostVars } from "./postVars";
import { PRICE_RESULT } from "../../../../../../types/enums/PRICE_RESULT";
import { type OptionsChain } from "opc-types/lib/OptionsChain";
import { type PriceData } from "opc-types/lib/PriceData";
import { MESSAGES } from "../../../../../../consts";
import { type DataInfo } from "./types";
import { makeDataReq } from "./makeDataReq";
import { parseDataResp } from "./parseDataResp";

export const getPriceData = async (
  symb: string,
  month: t.Optional<string>
): Promise<t.Outcome<PriceData>> => {
  // useMonth is like if they asked for the symbol on spx and we know it should be a big symbol, then make month = TODAY()

  // const useMonth: Maybe<string> = await month
  //   .asyncLeftBind(async () => {
  //     const knownBigMonth = await cacherRead({ key: `cboe_bigMonths`, args: [symb]}) as Maybe<boolean>;
  //     return knownBigMonth.map(() => `${new Date().getFullYear()}${(new Date().getMonth() + 1)}`);
  //   });

  // TEMP:
  const useMonth = month;

  return getPostVars(symb, useMonth)
    .then(
      Mx.ifNotErrAsync((postVarsData) =>
        makeDataReq(symb, useMonth, postVarsData)
      )
    )
    .then(Mx.ifNotErrAsync((data) => parseDataResp(symb, useMonth, data)))
    .then(
      Mx.ifNotErr(
        (dataInfo: t.Outcome<DataInfo>): t.Outcome<PriceData> =>
          Mx.isErr(dataInfo) || false /* Mx.isErr(stockInfo) */
            ? {
                result:
                  Mx.isErr(dataInfo) &&
                  dataInfo.message === MESSAGES.OPTIONS_NOT_FOUND
                    ? PRICE_RESULT.OPTIONS_NOT_FOUND
                    : PRICE_RESULT.UNEXPECTED_FORMAT,
                time: Date.now(),
                stock: null,
                options: null,
              }
            : {
                result: PRICE_RESULT.SUCCESS,
                time: Date.now(),
                /* TEMP */
                stock: dataInfo.stockInfo,
                // bit of a type gimme here
                options: dataInfo.optionsInfo.toJS() as OptionsChain,
              }
      )
    );
};
