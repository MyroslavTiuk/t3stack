import { ifNotErr, withNotErr } from "errable";
import scrapy from "node-scrapy";
import * as R from "ramda";

import { type PriceData } from "opc-types/lib/PriceData";
import { type Outcome } from "opc-types/lib/Outcome";

import { getBestStockPriceFromStockData } from "~/utils/Finance/getBestStockPrice";
import { PRICE_RESULT } from "~/types/enums/PRICE_RESULT";
import { errorFactory } from "~/api/infrastructure/errorHanding";
import { MESSAGES } from "../../../../../consts";
import { get } from "../../../http";
import calculateGreeks from "../us/helpers/calculateGreeks";
import getOptionsChainFromTableData from "./getOptionsChainFromTableData";
import fixCommonSymbolMistakes from "./helpers/fixCommonSymbolMistakes";

const model = {
  body: "body",
  id: "#quotes > .block > h2",
  stockData: {
    last: ".quote-info >ul >:nth-child(1) >b",
    bid: ".quote-info >ul >:nth-child(3) >b",
    ask: ".quote-info >ul >:nth-child(4) >b",
    iv30: ".quote-info >ul >:nth-child(5) >b",
  },
  tableData: [
    "table.dataTable > tbody > tr",
    {
      call: {
        date: ":nth-child(1) (datasort)",
        dateDesc: ":nth-child(1)",
        bidPrice: ":nth-child(2)",
        askPrice: ":nth-child(3)",
        lastPrice: ":nth-child(4)",
        netChange: ":nth-child(5)",
        openInt: ":nth-child(6)",
        volume: ":nth-child(7)",
        strike: ":nth-child(8)",
      },
      put: {
        date: ":nth-child(9) (datasort)",
        dateDesc: ":nth-child(1)",
        bidPrice: ":nth-child(10)",
        askPrice: ":nth-child(11)",
        lastPrice: ":nth-child(12)",
        netChange: ":nth-child(13)",
        openInt: ":nth-child(14)",
        volume: ":nth-child(15)",
        strike: ":nth-child(8)",
      },
    },
  ],
};

function fetchData(symbol: string): Promise<Outcome<unknown>> {
  return get(`https://www.m-x.ca/nego_cotes_en.php?symbol=${symbol}*`, {
    randomizeProxy: true,
  })
    .then((resp) => {
      const normalisedResp =
        (resp as string)?.replace(/data-sort/g, "datasort") || "";
      const result = scrapy.extract(normalisedResp, model);
      if (!result?.body) {
        return errorFactory(MESSAGES.UNEXPECTED_FORMAT);
      }
      if (!result?.id) {
        return errorFactory(MESSAGES.SYMBOL_NOT_FOUND);
      }
      const optionsData = getOptionsChainFromTableData(
        result.tableData,
        symbol
      );
      const formattedStockData = R.mapObjIndexed(
        (s: string) => parseFloat(s.replace(/,%/g, "")),
        result.stockData
      ) as PriceData["stock"];

      return {
        result: PRICE_RESULT.SUCCESS,
        time: Date.now(),
        retrievedTime: Date.now(),
        stock: formattedStockData,
        options: optionsData,
      };
    })
    .then(
      withNotErr((dto) => {
        if (dto.stock === null || dto.options === null) return dto;
        return {
          ...dto,
          options: calculateGreeks(
            dto.options,
            getBestStockPriceFromStockData(dto.stock)
          ),
        };
      })
    )

    .catch((_) => {
      return errorFactory(MESSAGES.EXCHANGE_NOT_FOUND);
    });
}

function transformData(data: unknown) {
  return data as PriceData;
}

function getMXPriceData(symbol: string): Promise<Outcome<PriceData>> {
  return fetchData(symbol).then(ifNotErr((rawData) => transformData(rawData)));
}

export default function getPriceData(
  symbol: string
): Promise<Outcome<PriceData>> {
  const newSym = fixCommonSymbolMistakes(symbol);
  return getMXPriceData(newSym);
}
