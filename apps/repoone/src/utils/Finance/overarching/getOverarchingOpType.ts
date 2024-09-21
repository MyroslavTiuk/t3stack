import { type Strategy } from "opc-types/lib/Strategy";
import legsWithIds from "../../../pwa/store/selectors/currentCalculation/legsWithIds";
import { isStratLegStock } from "../Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";

const getOverarchingOpType = (calc: Strategy) => {
  const legs = legsWithIds(calc.legsById);
  const commonType = legs.reduce((acc, leg) => {
    return isStratLegStock(leg) || !leg.opType
      ? acc
      : acc === false
      ? leg.opType
      : leg.opType !== acc
      ? null
      : acc;
  }, false as Nullable<string> | false);
  return commonType || null;
};

export default getOverarchingOpType;
