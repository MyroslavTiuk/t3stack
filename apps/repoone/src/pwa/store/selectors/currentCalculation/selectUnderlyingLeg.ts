import { type CurrentCalculationState } from "opc-types/lib/store/CurrentCalculationState";
import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { type Nullable } from "opc-types/lib/util/Nullable";

const selectUnderlyingLeg = (curCalc: CurrentCalculationState) =>
  (curCalc?.legsById[curCalc?.underlyingElement || ""] ||
    null) as Nullable<StratLegStock>;

export default selectUnderlyingLeg;
