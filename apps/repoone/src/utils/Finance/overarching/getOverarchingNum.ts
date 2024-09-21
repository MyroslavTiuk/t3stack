import { type Strategy } from "opc-types/lib/Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";
import legsWithIds from "../../../pwa/store/selectors/currentCalculation/legsWithIds";

const getOverarchingNum = (calc: Strategy) => {
  const legs = legsWithIds(calc.legsById);
  return (
    legs.reduce(
      (acc, leg) =>
        acc === null || (leg.num && leg.num <= (acc || 0)) ? leg.num : acc,
      null as Nullable<number>
    ) || null
  );
};

export default getOverarchingNum;
