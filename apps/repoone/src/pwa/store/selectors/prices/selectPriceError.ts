import { pipe } from "ramda";
import { ifNotUndefined } from "errable";

import { type Store } from "opc-types/lib/store/Store";
import { type Optional } from "opc-types/lib/util/Optional";

import MESSAGES from "../../../../consts/MESSAGES";

type PriceError = { symbol?: string; error: string };

const lookupErrorCodeDesc = (err: string) =>
  ({
    [MESSAGES.SYMBOL_NOT_FOUND]: "Stock or index not found",
    [MESSAGES.OPTIONS_NOT_FOUND]: "Option prices not found for this symbol",
  }[MESSAGES[err]] || "An error occurred looking up prices");

const selectPriceError =
  (symb: string) =>
  (store: Pick<Store, "prices">): Optional<string> =>
    pipe(
      () => store.prices.errors,
      (_priceErrors) =>
        (Array.isArray(_priceErrors)
          ? _priceErrors
          : [{ symbol: symb, error: "UNKNOWN" }]) as PriceError[],
      (_priceErrors) => _priceErrors.find((err) => err?.symbol === symb),
      ifNotUndefined((found) => found.error),
      ifNotUndefined(lookupErrorCodeDesc)
    )();

export default selectPriceError;
