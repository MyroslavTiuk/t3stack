import { INF, _INF } from "../../../consts/MATH";

import { type NumberOrInfinity } from "opc-types/lib/util/NumberOrInfinity";

const isInfinite = (
  infNum: NumberOrInfinity
): infNum is typeof INF | typeof _INF =>
  infNum === Infinity ||
  infNum === -Infinity ||
  infNum === INF ||
  infNum === _INF;

export default isInfinite;
