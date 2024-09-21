import { type Strategy } from "opc-types/lib/Strategy";
import legsWithIds from "../../../pwa/store/selectors/currentCalculation/legsWithIds";
import { isStratLegStock } from "../Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";

const getOverarchingExpiry = (calc: Strategy) => {
  const legs = legsWithIds(calc.legsById);
  const commonExp = legs.reduce((acc, leg) => {
    return isStratLegStock(leg) || !leg.expiry
      ? acc
      : acc === false
      ? leg.expiry
      : leg.expiry !== acc
      ? null
      : // note: Below will find nearest expiry
        // : acc === null ? leg.expiry
        // : leg.expiry < acc ? leg.expiry
        acc;
  }, false as Nullable<string> | false);
  return commonExp || null;
};

export default getOverarchingExpiry;
