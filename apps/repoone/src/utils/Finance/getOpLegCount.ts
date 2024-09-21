import { type Nullable } from "errable";
import { type Strategy } from "opc-types/lib/Strategy";
import { isStratLegOpt } from "./Strategy";

const getOpLegCount = (curCalc: Nullable<Strategy>) =>
  curCalc?.legs?.reduce(
    (opCt, legId) =>
      !curCalc?.legsById
        ? opCt
        : opCt + Number(isStratLegOpt(curCalc?.legsById[legId])),
    0
  ) || 0;

export default getOpLegCount;
