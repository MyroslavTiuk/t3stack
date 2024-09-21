import R from "ramda";

import { type Err, ifNotErr, isErr, withNotErr } from "errable";
import { type t } from "opc-types/lib";
import { type PriceData } from "opc-types/lib/PriceData";
import { type Optional } from "opc-types/lib/util/Optional";

import { cacher } from "../../../../cacher/cacher";
import Exchanges from "../../../../../../config/Exchanges";
import ENV from "../../../../../../config/Env";
import { errorFactory } from "~/api/infrastructure/errorHanding";
import { getBestStockPriceFromStockData } from "~/utils/Finance/getBestStockPrice";

import calculateGreeks from "../helpers/calculateGreeks";
import fetchPriceData from "./fetchPriceData";
import transformResult from "./transformResult";
import filterOptionsByCurrentExpiry from "../helpers/filterOptionsByCurrentExpiry";
import { cacheOrGet } from "~/api/services/cacher/NodeCacher";

function replaceIndexSymbol(stock: string, rpl = ".") {
  return [".", "^", "$"].includes(stock.slice(0, 1))
    ? `${rpl}${stock.slice(1)}`
    : stock;
}
function addIndexSymb(stock: string, rpl: string, stocksToMatch: string[]) {
  return stocksToMatch.includes(stock) ? `${rpl}${stock}` : stock;
}

const getPriceCboe2020 = async (
  rawStock: string,
  _month: Optional<string>
): Promise<t.Outcome<PriceData>> => {
  const result = await Promise.resolve(rawStock)
    .then((s) => s.toUpperCase())
    .then((s) => replaceIndexSymbol(s, "_"))
    .then((s) => addIndexSymb(s, "_", ["NDX", "SPX", "XSP", "VIX"]))
    .then((stock): Promise<t.Outcome<{ stock: string; data: unknown }>> => {
      return cacheOrGet("cboe2020_req", fetchPriceData, [stock]).then(
        (data) => {
          return isErr(data)
            ? (data as Err<t.ErrorData>)
            : {
                stock,
                data,
              };
        }
      );

      //OLD Generation
      return (fetchPriceData(stock) as Promise<t.Outcome<unknown>>).then(
        (data) => {
          return isErr(data)
            ? (data as Err<t.ErrorData>)
            : {
                stock,
                data,
              };
        }
      );
      return (
        cacher<unknown, [string]>(
          {
            key: "cboe2020_req",
            time: Exchanges.TTL_PRICE_DATA_THIRD_PARTY,
            args: [stock],
            shouldUse: R.always(ENV.USE_CACHE_REQ),
          },
          fetchPriceData
        ) as Promise<t.Outcome<unknown>>
      ).then((data) => {
        return isErr(data)
          ? (data as Err<t.ErrorData>)
          : {
              stock,
              data,
            };
      });
    })
    .then(
      ifNotErr<t.ErrorData, { stock: string; data: unknown }, PriceData>(
        ({ stock, data }) => transformResult(stock, data)
      )
    )
    .then(ifNotErr((priceData) => filterOptionsByCurrentExpiry(priceData)))
    .then(
      withNotErr((dto) => {
        if (dto.stock === null || dto.options === null) return dto;
        return {
          ...dto,
          options: calculateGreeks(
            dto.options,
            getBestStockPriceFromStockData(dto.stock)
          ),
        } as PriceData;
      })
    )
    .then(
      ifNotErr(
        (data) =>
          ({
            ...data,
            time: Date.now(),
          } as PriceData)
      )
    )
    .catch((_) => {
      return errorFactory("UNKNOWN");
    });

  return result;
};

export default getPriceCboe2020;
