import { type ObjRecord } from "opc-types/lib/util/ObjRecord";

export type HightlightEnum = true | false | "WARNING";

export const HIGHLIGHT: ObjRecord<HightlightEnum> = {
  NO_HIGHLIGHT: false,
  HIGHLIGHT: true,
  WARNING: "WARNING",
};
