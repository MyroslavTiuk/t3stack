import { type Strategy } from "opc-types/lib/Strategy";
import { type StratLeg } from "opc-types/lib/StratLeg";
import { lensPath, mapObjIndexed, set } from "ramda";

const updateLegs = (
  strat: Strategy,
  legUpdater: (chkLeg: StratLeg, legId: string) => StratLeg
) =>
  set(
    lensPath(["legsById"]),
    mapObjIndexed((leg, legId) => legUpdater(leg, legId), strat.legsById),
    strat
  );

export default updateLegs;
