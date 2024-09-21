import presetActions from "../../../utils/Redux/presetActions/presetActions";
import { type PriceData } from "opc-types/lib/PriceData";
import makeCreateActions from "../../../utils/Redux/makeCreateActions/makeCreateActions";

const ns = "PRICE";

export type PriceDataAndSymbol = {
  symbol: string;
  meta?: {
    autoRefresh?: boolean;
    refreshPriceRangeOnly?: boolean;
    fillPriceIfBlank?: boolean;
  };
} & PriceData;

type PriceAndSubseqAction = {
  symbol: string;
  dispatchCall: (prices: PriceDataAndSymbol) => void;
};

export default {
  getPrice: presetActions.makeAsyncAction<PriceDataAndSymbol>(`${ns}/LOOKUP`),
  ...makeCreateActions(ns)({
    pricesAvailableForSymbol: presetActions.makeIdentity<PriceDataAndSymbol>(),
    getPricesThenDispatch: presetActions.makeIdentity<PriceAndSubseqAction>(),
  }),
};
