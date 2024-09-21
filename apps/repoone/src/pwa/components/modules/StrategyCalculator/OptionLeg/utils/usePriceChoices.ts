import { useMemo } from "react";
import { pipe, filter } from "ramda";

import { PRICE_RESULT } from "../../../../../../types/enums/PRICE_RESULT";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type Optional } from "opc-types/lib/util/Optional";
import { type PriceData } from "opc-types/lib/PriceData";
import { type OptionsChain } from "opc-types/lib/OptionsChain";
import { type PriceChoice } from "../../types/PriceChoice";

import * as E from "errable";
import round from "../../../../../../utils/Data/round/round";
import opTypeKey from "../../../../../../utils/String/opTypeKey/opTypeKey";

const usePriceChoices = (
  prices: Optional<PriceData>,
  expiry: Nullable<string>,
  opType: Nullable<"call" | "put">,
  strike: Nullable<number>
): PriceChoice[] =>
  useMemo(() => {
    if (
      !prices ||
      prices.result !== PRICE_RESULT.SUCCESS ||
      !expiry ||
      !opType ||
      !strike
    ) {
      return [];
    }
    return pipe(
      (priceChain: OptionsChain) =>
        priceChain[expiry]?.[opTypeKey(opType)]?.[strike] || null,
      E.ifNotNull(
        (xps) =>
          [
            { position: "bid", price: xps.b || -1 },
            {
              position: "mid",
              price: (xps.b && xps.a && round((xps.a + xps.b) / 2, 2)) || -1,
            },
            { position: "ask", price: xps.a || -1 },
            { position: "last", price: xps.l || -1 },
          ] as PriceChoice[]
      ),
      E.ifNotNull(filter<PriceChoice>((chc) => chc.price !== -1)),
      (choices) => (choices === null ? [] : choices)
    )(prices.options);
  }, [prices, expiry, opType, strike]);

export default usePriceChoices;
