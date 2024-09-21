import { type Store } from "opc-types/lib/store/Store";
import { type Optional } from "opc-types/lib/util/Optional";
import { type PriceData } from "opc-types/lib/PriceData";

const selectSymbolPrices =
  (symb: string) =>
  (store: Store): Optional<PriceData> =>
    store.prices.data?.[symb] || undefined;

export default selectSymbolPrices;
