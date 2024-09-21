import { type StratLeg } from "opc-types/lib/StratLeg";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import objectEntries from "../../../../utils/Data/objectEntries/objectEntries";
import {
  type StratLegOpt,
  type StratLegOptComplete,
} from "opc-types/lib/StratLegOpt";
import { type Nullable } from "opc-types/lib/util/Nullable";

type ReturnType =
  | (StratLeg & { legId: string })
  | (StratLegOpt & { legId: string })
  | (StratLegOptComplete & { legId: string });

function legsWithIds(
  calcLegs: ObjRecord<StratLegOptComplete>,
  legs?: string[]
): (StratLegOptComplete & { legId: string })[];
function legsWithIds(
  calcLegs: ObjRecord<StratLegOpt>,
  legs?: string[]
): (StratLegOpt & { legId: string })[];
function legsWithIds(
  calcLegs: ObjRecord<StratLeg>,
  legs?: string[]
): (StratLeg & { legId: string })[];
function legsWithIds(
  calcLegs:
    | ObjRecord<StratLeg>
    | ObjRecord<StratLegOpt>
    | ObjRecord<StratLegOptComplete>,
  legs?: string[]
): ReturnType[] {
  if (legs) {
    return legs
      .map((legId) =>
        !calcLegs[legId]
          ? null
          : ({
              legId,
              ...calcLegs[legId],
            } as Nullable<ReturnType>)
      )
      .filter((x) => !!x) as ReturnType[];
  }
  return objectEntries(calcLegs).map(
    (pair) =>
      ({
        legId: pair[0],
        ...pair[1],
      } as ReturnType)
  );
}

export default legsWithIds;
