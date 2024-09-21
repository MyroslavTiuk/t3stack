import { type StrategyComplete } from "opc-types/lib/Strategy";
import filterOptionLegs from "../../../../pwa/store/selectors/currentCalculation/filterOptionLegs";
import legsWithIds from "../../../../pwa/store/selectors/currentCalculation/legsWithIds";
import { isDebitSpreadLegs } from "../../../../utils/Finance/strategyMatchers/isDebitSpread";
import { isCreditSpreadLegs } from "../../../../utils/Finance/strategyMatchers/isCreditSpread";
import round from "../../../../utils/Data/round/round";

// Note: mutates param
export function trimFreeSpreads(mutableStratCmpl: StrategyComplete) {
  const opLegs = legsWithIds(filterOptionLegs(mutableStratCmpl));
  const isADebitSpread = isDebitSpreadLegs(opLegs);
  const isACreditSpread = !isADebitSpread && isCreditSpreadLegs(opLegs);
  if (isADebitSpread || isACreditSpread) {
    // @ts-ignore
    const width = Math.abs(opLegs[1].strike - opLegs[0].strike);
    const spreadCost = Math.abs(opLegs[1].price - opLegs[0].price);
    if (
      (isADebitSpread && spreadCost <= 0) ||
      (isACreditSpread && spreadCost > round(width - 0.01, 2))
    ) {
      const boughtLeg = opLegs.find((leg) => leg.act === "buy");
      if (boughtLeg && isACreditSpread) {
        mutableStratCmpl.legsById[boughtLeg.legId].price = round(
          (mutableStratCmpl.legsById[boughtLeg.legId].price || 0) +
            (spreadCost - width + 0.01),
          2
        );
      } else if (boughtLeg && isADebitSpread) {
        mutableStratCmpl.legsById[boughtLeg.legId].price = round(
          (mutableStratCmpl.legsById[boughtLeg.legId].price || 0) +
            (-spreadCost + 0.01),
          2
        );
      }
    }
  }
  return mutableStratCmpl;
}
