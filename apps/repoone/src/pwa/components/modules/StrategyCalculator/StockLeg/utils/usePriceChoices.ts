import { useMemo } from "react";

import { PRICE_RESULT } from "../../../../../../types/enums/PRICE_RESULT";
import { type PriceData } from "opc-types/lib/PriceData";
import { type Optional } from "opc-types/lib/util/Optional";

import { type PriceChoice } from "../../types/PriceChoice";
import round from "../../../../../../utils/Data/round/round";

const usePriceChoices = (prices: Optional<PriceData>): PriceChoice[] =>
  useMemo(() => {
    if (!prices || prices.result !== PRICE_RESULT.SUCCESS) {
      return [];
    }
    const mid =
      (prices.stock.bid &&
        prices.stock.ask &&
        round((prices.stock.bid + prices.stock.ask) / 2, 2)) ||
      -1;
    return [
      { position: "bid", price: prices.stock.bid || -1 },
      { position: "mid", price: mid },
      { position: "ask", price: prices.stock.ask || -1 },
      { position: "last", price: prices.stock.last || -1 },
    ].filter((chc) => chc.price !== -1);
  }, [prices]);

export default usePriceChoices;
