import { type StrategyComplete } from "opc-types/lib/Strategy";
import filterOptionLegs from "../../pwa/store/selectors/currentCalculation/filterOptionLegs";
import selectUnderlyingLeg from "../../pwa/store/selectors/currentCalculation/selectUnderlyingLeg";

export const isShortCall = (strat: StrategyComplete) => {
  const optLegsArr = Object.values(filterOptionLegs(strat));
  const undLeg = selectUnderlyingLeg(strat);
  if (!undLeg) return false;
  return (
    (undLeg.num || 0) / 100 < (optLegsArr[0]?.num || 0) &&
    optLegsArr.length === 1 &&
    optLegsArr[0]?.opType === "call" &&
    optLegsArr[0]?.act === "sell"
  );
};

export const isShortPut = (strat: StrategyComplete) => {
  const optLegsArr = Object.values(filterOptionLegs(strat));
  return (
    !optLegsArr?.[0]?.settings?.collateralPerc &&
    optLegsArr.length === 1 &&
    optLegsArr[0]?.opType === "put" &&
    optLegsArr[0]?.act === "sell"
  );
};

export const isCashSecuredPut = (strat: StrategyComplete) => {
  const optLegsArr = Object.values(filterOptionLegs(strat));
  return (
    optLegsArr?.[0]?.settings?.collateralPerc === 100 &&
    optLegsArr.length === 1 &&
    optLegsArr[0]?.opType === "put" &&
    optLegsArr[0]?.act === "sell"
  );
};
