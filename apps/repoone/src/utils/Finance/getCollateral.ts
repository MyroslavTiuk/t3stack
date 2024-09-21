import { type StrategyComplete } from "opc-types/lib/Strategy";
import {
  type StratLegStock,
  type StratLegStockComplete,
} from "opc-types/lib/StratLegStock";
import { type StratLegOptComplete } from "opc-types/lib/StratLegOpt";

import { BROADBASED_INDEX_SYMBOLS } from "../../consts/BROADBASED_INDEX_SYMBOLS";
import CentsMath from "../CentsMath/CentsMath";

import getBestStockPrice from "./getBestStockPrice";
import { isStratLegOpt, isStratLegStock } from "./Strategy";
import {
  isCashSecuredPut,
  isShortCall,
  isShortPut,
} from "./strategyValidators";
import filterOptionLegs from "../../pwa/store/selectors/currentCalculation/filterOptionLegs";
import legsWithIds from "../../pwa/store/selectors/currentCalculation/legsWithIds";

const isIndexOption = (legUnd: StratLegStockComplete) =>
  BROADBASED_INDEX_SYMBOLS.includes((legUnd.val || "").toUpperCase());

const getCollateral = (strat: StrategyComplete) => {
  if (isShortCall(strat) || isShortPut(strat)) {
    // True for equity options
    const otmFlip = isShortPut(strat) ? -1 : 1;
    const opLegs = filterOptionLegs(strat);
    const legOp = Object.values(opLegs)[0] as StratLegOptComplete;
    if (!legOp) return null;
    const legUnd = strat.legsById.underlying as StratLegStockComplete;
    const percReqInit = isIndexOption(legUnd) ? 0.15 : 0.2;
    const percReqMin = 0.1;

    const undPrice = getBestStockPrice(legUnd as StratLegStock);
    if (
      !isStratLegOpt(legOp) ||
      !legUnd ||
      !undPrice ||
      !isStratLegStock(legUnd)
    ) {
      return null;
    }
    const cctMult = legOp.num * (legUnd.contractsPerShare || 100);

    const initMargin =
      legOp.price * cctMult +
      CentsMath.mult(cctMult, percReqInit) * undPrice -
      CentsMath.mult(
        Math.max(0, otmFlip * CentsMath.sub(legOp.strike, undPrice)),
        cctMult
      );

    const minMargin =
      legOp.price * cctMult +
      CentsMath.mult(
        CentsMath.mult(cctMult, percReqMin),
        isShortPut(strat) ? legOp.strike : undPrice
      );

    return -Math.max(initMargin, minMargin);
  } else if (isCashSecuredPut(strat)) {
    const opLegs = legsWithIds(filterOptionLegs(strat));
    const putOp = opLegs[0];
    if (!putOp) {
      return null;
    }
    return -putOp.strike * putOp.num * 100;
  }
  return null;
};

export default getCollateral;
