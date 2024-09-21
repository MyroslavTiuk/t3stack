import { type Nullable } from "opc-types/lib/util/Nullable";
import { type DisplayValueTypes } from "opc-types/lib/DisplayValueTypes";
import { type ResultsMatrixProps } from "../ResultsMatrix.view";
import calcDisplayVals, { type DispTuple } from "./calcDisplayVals";

const calcMaxMinVisibleVals = (
  displayType: DisplayValueTypes,
  scaleForDispValStratValue: number,
  props: ResultsMatrixProps
): DispTuple => {
  const calc = Object.values(props.stratEst.theoPoints).reduce(
    (maxMin: [Nullable<number>, Nullable<number>], theoPointsAtPrice) =>
      Object.values(theoPointsAtPrice).reduce((maxMinAtP, posEst) => {
        const dispVals = calcDisplayVals[displayType](
          props.stratEst.initial,
          posEst.gross,
          props.stratEst.summary,
          scaleForDispValStratValue
        );
        if (maxMinAtP[0] === null || maxMinAtP[1] === null) {
          return [dispVals[1], dispVals[1]] as DispTuple;
        }
        return [
          dispVals[1] < maxMinAtP[0] ? dispVals[1] : maxMinAtP[0],
          dispVals[1] > maxMinAtP[1] ? dispVals[1] : maxMinAtP[1],
        ] as DispTuple;
      }, maxMin),
    [null, null]
  );
  if (calc[0] === null || calc[1] === null) return [0, 0];
  return calc as [number, number];
};

export default calcMaxMinVisibleVals;
