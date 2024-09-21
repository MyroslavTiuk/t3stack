import { type Nullable } from "./util/Nullable";

interface StratLegOptValuesComplete {
  act: "sell" | "buy";
  opType: "call" | "put";
  expiry: string; // YYYY-MM-DD
  strike: number;
  iv: number[] | number;
  num: number;
  price: number;
  priceRange: [number, number];
}

// What values can be set for an Option
interface StratLegOptValues {
  name: string;
  underlying: string;
  act: Nullable<StratLegOptValuesComplete["act"]>;
  opType: Nullable<StratLegOptValuesComplete["opType"]>;
  expiry: Nullable<StratLegOptValuesComplete["expiry"]>;
  strike: Nullable<StratLegOptValuesComplete["strike"]>;
  iv: Nullable<StratLegOptValuesComplete["iv"]>;
  num: Nullable<StratLegOptValuesComplete["num"]>;
  price: Nullable<StratLegOptValuesComplete["price"]>;
  priceRange: [Nullable<number>, Nullable<number>];
  // pricePoint: Nullable<number>; // 0 = bid, 0.5 = mid etc
  // inputStyle: Nullable<'quick' | 'relative' | 'ToS'>;
  // linkNum: boolean;
  // linkExpiry: boolean;
  // linkOpType: boolean;
  // linkStrike: boolean;
  showDetails: boolean;
  showGreeks: boolean;
  showExitPrice: boolean;
  customPrice: boolean;
  disabled: boolean;
}

interface StratLegOptSettings {
  renamable: boolean;
  // changeAct: boolean;
  // changeOpType: boolean;
  // showUnderlying: boolean;
  suggestedNumEle?: string[]; // todo: use the idea of 'linkGroupName'
  suggestedNum: number[];
  numWeight?: number;
  collateralPerc?: number;
  // suggestedExpiryEle | expiryLinkGroupName
}

// The fields that can have a default set for them
interface StratLegOptDefaults
  extends Omit<StratLegOptValues, "iv" | "price" | "strike" | "disabled"> {}

// The type to use when defining a Strategy - with all required and optional default fields
export interface StratLegOptDef {
  type: "option";
  defaults: Partial<StratLegOptDefaults> &
    Pick<StratLegOptValues, "name" | "underlying">;
  settings?: Partial<StratLegOptSettings>;
}

// A default-filled filled Strategy Option leg
export interface StratLegOpt extends StratLegOptDef, StratLegOptValues {
  defaults: StratLegOptDefaults;
  settings: StratLegOptSettings;
}

export interface StratLegOptComplete
  extends Omit<
      StratLegOpt,
      | "act"
      | "opType"
      | "expiry"
      | "strike"
      | "iv"
      | "num"
      | "price"
      | "priceRange"
    >,
    StratLegOptValuesComplete {}
