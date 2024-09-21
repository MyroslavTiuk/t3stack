import { type Strategy } from "opc-types/lib/Strategy";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type StratName } from "opc-types/lib/StratName";
import { type PriceData } from "opc-types/lib/PriceData";
import Strategies from "../../../model/Strategies";

import TransformStrategy from "./TransformStrategy";
import transformV2calc from "./convertV2calc-transform";

export type V2CalcSkel = {
  strat: string;
  vars: ObjRecord<string>;
};

function checkV2calcShape(
  hopefullyV2calc: unknown
): hopefullyV2calc is V2CalcSkel {
  return (
    typeof hopefullyV2calc === "object" &&
    // @ts-ignore
    typeof hopefullyV2calc?.strat === "string" &&
    // @ts-ignore
    typeof hopefullyV2calc?.vars === "object"
  );
}

const stratMap: Record<string, StratName> = {
  "covered-call": "covered-call",
  //'synthetic-put'
  //'reverse-conversion',
  purch: "purchase",
  spread: "vertical-spread",
  "long-call": "long-call",
  "short-call": "short-call",
  "long-put": "long-put",
  "short-put": "short-put",
  "call-spread": "bullish-call-debit-spread",
  "call-spread-credit": "bearish-call-credit-spread",
  "ratio-back-spread": "ratio-backspread",
  "put-spread": "bullish-put-credit-spread",
  "put-spread-debit": "bearish-put-debit-spread",
  "calendar-spread": "calendar-spread",
  "credit-spread": "bullish-put-credit-spread",
  "diagonal-spread": "diagonal-spread",
  "8-legs": "8-legs",
  "7-legs": "7-legs",
  "6-legs": "6-legs",
  "5-legs": "5-legs",
  "4-legs": "4-legs",
  "3-legs": "3-legs",
  "2-legs": "2-legs",
  straddle: "straddle",
  strangle: "strangle",
  "iron-condor": "iron-condor",
  butterfly: "butterfly",
  "double-diagonal-spread": "double-diagonal-spread",
  "pmcc-poor-mans-covered-call": "pmcc-poor-mans-covered-call",
  "cash-secured-put": "cash-secured-put",
  // 'covered_strangle': 'straddle',
  // 'covered_3opts': 'straddle',
};

const convertV2calc = (
  hopefullyV2calc: unknown,
  prices?: ObjRecord<PriceData>
): Nullable<Strategy> => {
  if (!checkV2calcShape(hopefullyV2calc)) return null;
  const v2calc = hopefullyV2calc;

  const newStratKey = stratMap[v2calc.strat];
  if (!newStratKey) return null;

  const newStrat = TransformStrategy.stratToInitialState(
    Strategies.getStrategy(newStratKey),
    { wasImported: true }
  );
  try {
    transformV2calc(newStrat, v2calc, prices);
    return newStrat;
  } catch (e) {
    return null;
  }
};

export default convertV2calc;
