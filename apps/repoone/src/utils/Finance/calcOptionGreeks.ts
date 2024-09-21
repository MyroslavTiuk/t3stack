import { type Strategy } from "opc-types/lib/Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";
import getBestStockPrice from "./getBestStockPrice";
import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { isStratLegOpt } from "./Strategy";
import timeTilExpiry from "../Time/timeTilExpiry";
import { black_scholes } from "../../services/calculate/blackScholes";
import { FINANCE } from "../../config/Finance";
import { type TIME_DECAY_BASIS } from "../../types/enums/TIME_DECAY_BASIS";

const calcOptionGreeks = (
  curCalc: Nullable<Strategy>,
  timeDecayBasis: TIME_DECAY_BASIS,
  legId: string
) => {
  const curLeg = curCalc?.legsById[legId];
  const S = getBestStockPrice(
    curCalc?.legsById[curCalc?.underlyingElement || ""] as StratLegStock
  );
  if (
    !curLeg ||
    !isStratLegOpt(curLeg) ||
    !S ||
    !curLeg.opType ||
    !curLeg.strike ||
    !curLeg.expiry ||
    !curLeg.iv
  )
    return null;
  const t = timeTilExpiry(
    curLeg.expiry,
    timeDecayBasis,
    curCalc?.timeOfCalculation || Date.now()
  );

  return black_scholes(
    curLeg.opType === "call",
    S,
    curLeg.strike,
    FINANCE.INTEREST_RATE,
    // @ts-ignore
    curLeg.iv,
    t,
    undefined,
    true
  );
};

export default calcOptionGreeks;
