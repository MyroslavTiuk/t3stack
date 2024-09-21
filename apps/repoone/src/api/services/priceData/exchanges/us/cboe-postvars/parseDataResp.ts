import * as Mx from "errable";
import { type Optional } from "errable";
import R from "ramda";

import { type t } from "opc-types/lib";
import { getBestStockPriceFromStockData } from "../../../../../../utils/Finance/getBestStockPrice";

import { type DataInfo } from "./types";
import { extractOptionData, validateResponse } from "./optionInfo";
import { extractStockData } from "./stockInfo";
import { calculateGreeksImm } from "../helpers/calculateGreeks";

export async function parseDataResp(
  symb: string,
  month: Optional<string>,
  data: string
): Promise<t.Outcome<DataInfo>> {
  return Promise.resolve(data)
    .then(
      Mx.ifNotErrAsync((quoteReqResult: string) =>
        validateResponse(symb, month, quoteReqResult)
      )
    )
    .then(Mx.withNotErr((_) => ({ quoteReqResult: _ })))
    .then(
      Mx.ifNotErr((dto) =>
        R.pipe(
          extractOptionData,
          Mx.withNotErr((optionsInfo) => ({ ...dto, optionsInfo }))
        )(dto.quoteReqResult)
      )
    )
    .then(
      Mx.ifNotErr((dto) =>
        R.pipe(
          extractStockData,
          Mx.withNotErr((stockInfo) => ({ ...dto, stockInfo }))
        )(dto.quoteReqResult)
      )
    )
    .then(
      Mx.withNotErr((dto) => {
        return {
          stockInfo: dto.stockInfo,
          optionsInfo: calculateGreeksImm(
            dto.optionsInfo,
            getBestStockPriceFromStockData(dto.stockInfo)
          ),
        };
      })
    );
}
