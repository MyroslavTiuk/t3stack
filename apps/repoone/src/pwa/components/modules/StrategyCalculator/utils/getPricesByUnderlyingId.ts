import { type Store } from "opc-types/lib/store/Store";
import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { type Nullable } from "opc-types/lib/util/Nullable";

export const getPricesByUnderlyingId =
  (undLegId: Nullable<string> = null) =>
  (store: Store) => {
    const undLegId2 = undLegId || store.currentCalculation?.underlyingElement;
    const symb = undLegId2
      ? (store.currentCalculation?.legsById[undLegId2] as StratLegStock).val
      : "";
    return (store.prices.data || {})[symb];
  };
