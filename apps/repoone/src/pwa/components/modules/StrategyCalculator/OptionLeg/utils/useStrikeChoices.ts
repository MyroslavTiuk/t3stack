import { useMemo } from "react";
import { pipe, uniq, sort, map } from "ramda";
import { isUndefined } from "errable";

import { type PriceData } from "opc-types/lib/PriceData";
import { type Optional } from "opc-types/lib/util/Optional";
import { type Strategy } from "opc-types/lib/Strategy";

import { PRICE_RESULT } from "../../../../../../types/enums/PRICE_RESULT";
import formatPrice from "../../../../../../utils/String/formatPrice/formatPrice";
import opTypeKey from "../../../../../../utils/String/opTypeKey/opTypeKey";
import { getBestStockPriceFromStockData } from "../../../../../../utils/Finance/getBestStockPrice";
import round from "../../../../../../utils/Data/round/round";

import type StrikeChoice from "../types/StrikeChoice";
import formatPercent from "../../../../../../utils/String/formatPercent/formatPercent";
import getLegsAtStrike from "../../../../../../utils/Finance/getLegsAtStrike";

const useStrikeChoices = (
  prices: Optional<PriceData>,
  expiry: string | null,
  legs: Strategy["legsById"],
  opType: "put" | "call" | null
): StrikeChoice[] =>
  useMemo(() => {
    if (!prices || prices.result !== PRICE_RESULT.SUCCESS) {
      return [];
    }
    const bestStockPrice = getBestStockPriceFromStockData(prices.stock);
    const legsAtStrikes = getLegsAtStrike(legs);

    return pipe(
      () =>
        expiry && prices.options[expiry] !== undefined
          ? expiry
          : Object.keys(prices.options)[0],
      (exp) => prices.options[exp] || { c: {}, p: {} },
      (opts) =>
        ([] as string[])
          .concat(opType !== "put" ? Object.keys(opts[opTypeKey.CALL]) : [])
          .concat(opType !== "call" ? Object.keys(opts[opTypeKey.PUT]) : []),
      uniq,
      sort((a, b) => parseFloat(a) - parseFloat(b)),
      map((s: string): StrikeChoice => {
        const stkNum = parseFloat(s);
        const perc = !bestStockPrice
          ? undefined
          : (stkNum - bestStockPrice) / bestStockPrice;
        const opData =
          !opType || !expiry
            ? undefined
            : prices.options[expiry]?.[opTypeKey(opType)]?.[
                s as unknown as number
              ];
        return {
          strike: formatPrice(stkNum, {
            forceShowCents: true,
            hideDollar: true,
          }),
          percFromCur: perc
            ? `${perc > 0 ? "+" : ""}${formatPercent(
                perc,
                Math.abs(perc) >= 0.1 ? 0 : 1
              )}`
            : "",
          delta: opData?.d?.toFixed(2) || "-",
          priceBid: opData?.b || null,
          priceAsk: opData?.a || null,
          iv: (opData?.iv && round(opData?.iv, 1)) || null,
          legsAtStk: legsAtStrikes[stkNum] || [],
          isITM: isUndefined(bestStockPrice)
            ? false
            : (opType === "call" && stkNum <= bestStockPrice) ||
              (opType === "put" && stkNum >= bestStockPrice),
        };
      })
    )();
  }, [prices, expiry, opType, legs]);

export default useStrikeChoices;
