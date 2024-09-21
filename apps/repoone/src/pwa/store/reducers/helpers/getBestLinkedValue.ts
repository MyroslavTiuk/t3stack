import { type Strategy } from "opc-types/lib/Strategy";
import { type SpreadDetailsState } from "../../../components/modules/StrategyCalculator/SpreadDetails/SpreadDetails.props";
import * as E from "errable";
import { type Optional } from "opc-types/lib/util/Optional";
import getOverarchingProp from "../../../../utils/Finance/overarching/getOverarchingProp";
import getOverarchingExpiry from "../../../../utils/Finance/overarching/getOverarchingExpiry";
import getOverarchingNum from "../../../../utils/Finance/overarching/getOverarchingNum";
import getOverarchingStrike from "../../../../utils/Finance/overarching/getOverarchingStrike";
import getOverarchingOpType from "../../../../utils/Finance/overarching/getOverarchingOpType";

// eslint-disable-next-line @typescript-eslint/ban-types
const OVERARCHING: Record<keyof SpreadDetailsState, Optional<Function>> = {
  expiry: getOverarchingExpiry,
  num: getOverarchingNum,
  strike: getOverarchingStrike,
  opType: getOverarchingOpType,
};

export function getBestLinkedValue<T>(
  updatedState: Strategy,
  triggerLegId: Optional<string>,
  legIdToUpdate: string,
  key: keyof SpreadDetailsState,
  _fallbackParamValue: T
) {
  return !E.isUndefined(updatedState.legsById[triggerLegId || ""])
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore (cannot reference index)
      (updatedState.legsById[triggerLegId][key] as T) || ""
    : !E.isUndefined(OVERARCHING?.[key])
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore (just checked)
      OVERARCHING?.[key](updatedState)
    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getOverarchingProp(updatedState, key);
}
