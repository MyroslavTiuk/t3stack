import { type Nullable } from "opc-types/lib/util/Nullable";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";

type StrikeChoice = {
  strike: string;
  percFromCur: string;
  delta: string;
  priceBid: Nullable<number>;
  priceAsk: Nullable<number>;
  isITM: boolean;
  iv: Nullable<number>;
  legsAtStk: LegIndTuple[];
};

export type LegIndTuple = [StratLegOpt["act"], StratLegOpt["opType"]];

export default StrikeChoice;
