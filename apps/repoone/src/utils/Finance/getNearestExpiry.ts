import { type Strategy } from "opc-types/lib/Strategy";
import { isStratLegOpt } from "./Strategy";

const getNearestExpiry = (strat: Strategy) =>
  strat.legs.reduce((nearest: string | false, legId) => {
    const leg = strat.legsById[legId];
    if (!isStratLegOpt(leg)) return nearest;
    if (leg && leg.expiry && (nearest === false || leg.expiry < nearest))
      return leg.expiry;
    return nearest;
  }, false);

export default getNearestExpiry;
