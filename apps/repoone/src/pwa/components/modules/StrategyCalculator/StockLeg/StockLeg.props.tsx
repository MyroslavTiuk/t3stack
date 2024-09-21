import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { type Optional } from "opc-types/lib/util/Optional";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type StockData } from "opc-types/lib/StockData";
import { type ASYNC_STATUS } from "opc-types/lib/store/ASYNC_STATUS";
import { type PriceChoice } from "../types/PriceChoice";

export interface StockLegPassedProps {
  alwaysShowPricing?: boolean;
  dontShowPricing?: boolean;
}

export interface StockLegPublicProps extends StockLegPassedProps {
  leg: StratLegStock;
  legId: string;
}

export interface StockLegCalcedProps {
  leg: StockReducerState & { linkNum: boolean };
  name?: string;
  settings: StratLegStock["settings"];
  prices?: Optional<Omit<StockData, "ivHist">>;
  priceError: Optional<string>;
  priceChoices: PriceChoice[];
  lastRetrieved?: Optional<number>;
  priceStatus: ASYNC_STATUS;
  onPriceRefresh: () => void;
  chainAvailable: boolean;
  valOnChange: (val: string) => void;
  valOnSelect: (val: string) => void;
  actOnChange: (val: string) => void;
  actOnSelect: (val: string) => void;
  priceOnChange: (val: string) => void;
  priceOnSelect: (val: string) => void;
  numOnChange: (val: string) => void;
  numOnSelect: (val: string) => void;
  linkNumOnSelect: (val: boolean) => void;
  inputMethod: "stacked" | "inline";
  inputMethodMobile: "stacked" | "inline";
  atmIV: Nullable<number>;
  shouldShowTip: boolean;
  hideTip: () => void;
  setFocusLinkedField: (fieldName: Nullable<string>) => void;
  focusLinkedField: Nullable<string>;
}

export interface StockLegProps
  extends StockLegPassedProps,
    StockLegCalcedProps {}

export type StockReducerState = {
  val: string;
  act: Nullable<"buy" | "sell">;
  num: Nullable<string>;
  price: Nullable<string>;
};
