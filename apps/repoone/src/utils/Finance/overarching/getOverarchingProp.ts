import { type Strategy } from "opc-types/lib/Strategy";
import legsWithIds from "../../../pwa/store/selectors/currentCalculation/legsWithIds";
import { isStratLegStock } from "../Strategy";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";

function getOverarchingProp(calc: Strategy, prop: keyof StratLegOpt) {
  const legs = legsWithIds(calc.legsById);
  return legs.reduce(
    (acc, leg) => (!acc || isStratLegStock(leg) ? acc : (leg[prop] as boolean)),
    true
  );
}

export default getOverarchingProp;
