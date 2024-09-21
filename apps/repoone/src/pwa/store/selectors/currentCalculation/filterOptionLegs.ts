import { pipe } from "ramda";

import { type Strategy, type StrategyComplete } from "opc-types/lib/Strategy";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import {
  type StratLegOpt,
  type StratLegOptComplete,
} from "opc-types/lib/StratLegOpt";

import { isStratLegOpt } from "../../../../utils/Finance/Strategy";
import objectFromEntries from "../../../../utils/Data/objectFromEntries/objectFromEntries";
import objectEntries from "../../../../utils/Data/objectEntries/objectEntries";

type PickedStratComplete = Pick<StrategyComplete, "legs" | "legsById">;
type PickedStrat = Pick<Strategy, "legs" | "legsById">;

// todo: Revise, as this seems quite inefficient
function filterOptionLegs(
  calc: PickedStratComplete
): ObjRecord<StratLegOptComplete>;
function filterOptionLegs(calc: PickedStrat): ObjRecord<StratLegOpt>;
function filterOptionLegs(
  calc: PickedStrat | PickedStratComplete
): ObjRecord<StratLegOpt> | ObjRecord<StratLegOptComplete> {
  return pipe(
    () => calc.legs.filter((legId) => isStratLegOpt(calc.legsById[legId])),
    (opLegIds) =>
      objectFromEntries(
        objectEntries(calc.legsById).filter(([legId, _legData]) =>
          opLegIds.includes(legId as string)
        )
      ) as ObjRecord<StratLegOpt> | ObjRecord<StratLegOptComplete>
  )();
}

export default filterOptionLegs;
