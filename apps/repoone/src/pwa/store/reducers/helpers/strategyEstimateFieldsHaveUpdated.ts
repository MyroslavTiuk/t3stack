import { type Strategy } from "opc-types/lib/Strategy";
import legsWithIds from "../../selectors/currentCalculation/legsWithIds";
import {
  isStratLegOpt,
  isStratLegStock,
} from "../../../../utils/Finance/Strategy";

export function strategyEstimateFieldsHaveUpdated(
  origState: Strategy,
  updatedState: Strategy
) {
  const updatedStateLegs = legsWithIds(updatedState.legsById);
  const origStateLegs = legsWithIds(origState.legsById);
  if (
    updatedStateLegs.length !== origStateLegs.length ||
    updatedState.atmIV !== origState.atmIV ||
    updatedState.ivShift !== origState.ivShift
  )
    return true;
  return updatedStateLegs.reduce((hasUpdated, ulegWithId) => {
    const oLeg = origState.legsById[ulegWithId.legId];
    return hasUpdated
      ? true
      : (isStratLegOpt(ulegWithId) &&
          isStratLegOpt(oLeg) &&
          (ulegWithId.expiry !== oLeg.expiry ||
            ulegWithId.strike !== oLeg.strike ||
            ulegWithId.num !== oLeg.num ||
            ulegWithId.price !== oLeg.price ||
            ulegWithId.iv !== oLeg.iv ||
            ulegWithId.act !== oLeg.act ||
            ulegWithId.opType !== oLeg.opType ||
            ulegWithId.underlying !== oLeg.underlying)) ||
          (isStratLegStock(ulegWithId) &&
            isStratLegStock(oLeg) &&
            (ulegWithId.val !== oLeg.val ||
              ulegWithId.act !== oLeg.act ||
              ulegWithId.price !== oLeg.price ||
              ulegWithId.curPriceLast !== oLeg.curPriceLast ||
              ulegWithId.curPriceAsk !== oLeg.curPriceAsk ||
              ulegWithId.curPriceBid !== oLeg.curPriceBid));
  }, false);
}

export default strategyEstimateFieldsHaveUpdated;
