import { type SyntheticEvent } from "react";

import { type Nullable } from "opc-types/lib/util/Nullable";
import { type Strategy } from "opc-types/lib/Strategy";

import type noop from "../../../../../utils/Functional/noop";
import { type ExpiryChoice } from "../OptionLeg/OptionLeg.props";
import type StrikeChoice from "../OptionLeg/types/StrikeChoice";

export interface SpreadDetailsPassedProps {
  opLegCount: number;
  currentCalc: Strategy;
}

export type SpreadDetailsPublicProps = SpreadDetailsPassedProps;

export interface SpreadDetailsCalcedProps {
  spreadVals: SpreadDetailsState &
    Pick<Strategy, "linkExpiries" | "linkOpTypes" | "linkStrikes" | "linkNum">;
  savedSpreadVals: SpreadDetailsState;
  expiryChoices: ExpiryChoice[];
  strikeChoices: StrikeChoice[];
  multiOnChange: (
    val: string | boolean,
    evt: SyntheticEvent<HTMLElement>
  ) => void;
  multiOnBlur: (
    val: string | boolean,
    evt: SyntheticEvent<HTMLElement>
  ) => void;
  onToggleAll: (onOff: boolean) => void;
  pricesLoading: boolean;
  setFocusLinkedField: (fieldName: Nullable<string>) => void;
  focusLinkedField: Nullable<string>;
  getSymbPrices: typeof noop;
}

export interface SpreadDetailsProps
  extends SpreadDetailsPassedProps,
    SpreadDetailsCalcedProps {}

export type SpreadDetailsState = {
  num: Nullable<string>;
  expiry: Nullable<string>;
  strike: Nullable<string>;
  opType: Nullable<string>;
};
