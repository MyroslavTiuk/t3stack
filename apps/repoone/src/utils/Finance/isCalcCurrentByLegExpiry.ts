import { type Strategy } from "opc-types/lib/Strategy";
import filterOptionLegs from "../../pwa/store/selectors/currentCalculation/filterOptionLegs";
import legsWithIds from "../../pwa/store/selectors/currentCalculation/legsWithIds";
import newYorkTime from "../Time/newYorkTime";

const isCalcCurrentByLegExpiry = (calc: Strategy, now = Date.now()) => {
  const optLegs = legsWithIds(filterOptionLegs(calc));
  // return optLegs[0].expiry;
  return (
    optLegs.filter((optLeg) => {
      return !optLeg.expiry || newYorkTime(optLeg.expiry) < now;
    }).length === 0
  );
};

export default isCalcCurrentByLegExpiry;
