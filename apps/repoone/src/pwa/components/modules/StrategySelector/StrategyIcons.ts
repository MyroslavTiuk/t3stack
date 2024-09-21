import { type StratName } from "opc-types/lib/StratName";

// @ts-ignore
const StrategyIcons: Record<StratName, string | null> = {
  purchase: "purchase",
  "long-call": "long-call",
  "long-put": "long-put",
  "covered-call": "covered-call",
  "pmcc-poor-mans-covered-call": "misc",
  "cash-secured-put": "misc",
  "short-call": "short-call",
  "short-put": "short-put",
  "vertical-spread": "call-debit-put-credit-spread-bullish-collar",
  "bullish-call-debit-spread": "call-debit-put-credit-spread-bullish-collar",
  "bullish-put-credit-spread": "call-debit-put-credit-spread-bullish-collar",
  "bearish-call-credit-spread": "call-credit-put-debit-spread-bearish",
  "bearish-put-debit-spread": "call-credit-put-debit-spread-bearish",
  "calendar-spread": "calendar-spread",
  "diagonal-spread": "diagonal-spread",
  "ratio-backspread": "misc", // todo: add an icon
  "iron-condor": "iron-condor",
  butterfly: "butterfly",
  straddle: "straddle",
  strangle: "strangle",
  collar: "call-debit-put-credit-spread-bullish-collar",
  "covered-strangle": "covered-strangle",
  "double-diagonal-spread": "double-diagonal-spread",
  "8-legs": "misc",
  "7-legs": "misc",
  "6-legs": "misc",
  "4-legs": "misc",
  "5-legs": "misc",
  "3-legs": "misc",
  "2-legs": "misc",
  custom: "misc",
};

export default StrategyIcons;
