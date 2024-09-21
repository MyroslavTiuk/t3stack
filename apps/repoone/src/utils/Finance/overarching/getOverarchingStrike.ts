import { type Strategy } from "opc-types/lib/Strategy";
import legsWithIds from "../../../pwa/store/selectors/currentCalculation/legsWithIds";
import { isStratLegStock } from "../Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";

const getOverarchingStrike = (calc: Strategy) => {
  const legs = legsWithIds(calc.legsById);
  const commonStrike = legs.reduce((acc, leg) => {
    return isStratLegStock(leg) || !leg.strike
      ? acc
      : acc === false
      ? leg.strike
      : leg.strike !== acc
      ? null
      : acc;
  }, false as Nullable<number> | false);
  return commonStrike || null;
};

export default getOverarchingStrike;
