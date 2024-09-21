import DISPLAY_VALUE_TYPES from "./DISPLAY_VALUE_TYPES";
import { type DisplayValueTypes } from "opc-types/lib/DisplayValueTypes";

export type DVPair = [DisplayValueTypes, string];

export const displayValueTypePairs: DVPair[] = [
  [DISPLAY_VALUE_TYPES.ROI_MAX_RISK, "% Return on Risk"],
  [DISPLAY_VALUE_TYPES.ROI_COLLATERAL, "% Return on Collateral"],
  [DISPLAY_VALUE_TYPES.PERC_MAX_RETURN, "% of Max Return"],
  [DISPLAY_VALUE_TYPES.PL_DOLLARS, "P/L in Dollars"],
  [DISPLAY_VALUE_TYPES.STRATEGY_VALUE, "{trade} Value"],
];

export const displayValueTypePairsMob: DVPair[] = [
  [DISPLAY_VALUE_TYPES.ROI_MAX_RISK, "Return on Risk"],
  [DISPLAY_VALUE_TYPES.ROI_COLLATERAL, "Rtn on Collateral"],
  [DISPLAY_VALUE_TYPES.PERC_MAX_RETURN, "% Max Return"],
  [DISPLAY_VALUE_TYPES.PL_DOLLARS, "$ P/L"],
  [DISPLAY_VALUE_TYPES.STRATEGY_VALUE, "{trade} Value"],
];
