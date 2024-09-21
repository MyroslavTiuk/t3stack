import { type Nullable } from "opc-types/lib/util/Nullable";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";
import { type Strategy } from "opc-types/lib/Strategy";
import { type PriceChoice } from "../types/PriceChoice";
import type StrikeChoice from "./types/StrikeChoice";
import type noop from "../../../../../utils/Functional/noop";
import { type LAYOUT_OPTIONS } from "../../../../../types/enums/LAYOUT_OPTIONS";

export interface OptionLegPassedProps {
  legId: string;
  ofLegs: number;
}

export interface OptionLegPublicProps extends OptionLegPassedProps {
  leg: StratLegOpt;
}

export interface ExpiryChoice {
  date: string; // DD MMM YY
  dateCode: string; // YYYYMMDD
  // expiryType: string; // weekly, standard etc
}

export interface OptionLegCalcedProps {
  leg: OptionReducerState &
    Pick<Strategy, "linkExpiries" | "linkOpTypes" | "linkStrikes" | "linkNum">;
  savedLeg: OptionReducerState;
  name: string;
  inputMethod: "stacked" | "inline";
  inputMethodMobile: "stacked" | "inline";
  legSettings: StratLegOpt["settings"];
  curCalc: Strategy;
  curCalcLeg: StratLegOpt;
  optPrice: Nullable<{ b: number; a: number }>;
  optionCode: Nullable<string>;
  strikeChoices: StrikeChoice[];
  priceChoices: PriceChoice[];
  priceLoading: boolean;
  expiryChoices: ExpiryChoice[];
  stockNotSelected: boolean;
  actOnChange: (val: string) => void;
  actOnSelect: (val: string) => void;
  priceOnChange: (val: string) => void;
  priceOnSelect: (val: string) => void;
  opTypeOnChange: (val: string) => void;
  opTypeOnSelect: (val: string) => void;
  numOnChange: (val: string) => void;
  numOnSelect: (val: string) => void;
  strikeOnChange: (val: string) => void;
  strikeOnSelect: (val: string, item?: StrikeChoice) => void;
  expiryOnChange: (val: string) => void;
  expiryOnSelect: (val: string) => void;
  linkStrikesOnSelect: (val: boolean) => void;
  linkOpTypesOnSelect: (val: boolean) => void;
  linkNumOnSelect: (val: boolean) => void;
  linkExpiriesOnSelect: (val: boolean) => void;
  customPriceOnSelect: (val: boolean) => void;
  disabledOnSelect: (val: boolean) => void;
  toggleOptionChain: () => void;
  setFocusLinkedField: (fieldName: Nullable<string>) => void;
  focusLinkedField: Nullable<string>;
  showChainForLeg?: Nullable<string>;
  getSymbPrices: typeof noop;
  layout: LAYOUT_OPTIONS;
}

export interface OptionLegProps
  extends OptionLegPassedProps,
    OptionLegCalcedProps {
  removeLeg: () => void;
}

type TextFields = "opType" | "act" | "price" | "strike" | "num";

export type OptionReducerState = Omit<
  StratLegOpt,
  "type" | "priceRange" | "settings" | "defaults" | TextFields
> & {
  opType: string;
  act: string;
  price: string;
  strike: string;
  num: string;
};
