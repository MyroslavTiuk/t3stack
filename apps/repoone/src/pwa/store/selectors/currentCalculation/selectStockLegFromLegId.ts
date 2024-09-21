import { pipe } from "ramda";

import { type CurrentCalculationState } from "opc-types/lib/store/CurrentCalculationState";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";
import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { type Optional } from "opc-types/lib/util/Optional";

const selectStockLegFromLegId =
  (legId: string) =>
  (currentCalculation: CurrentCalculationState): Optional<StratLegStock> =>
    pipe(
      (cc: CurrentCalculationState) =>
        (cc?.legsById[legId] as StratLegOpt)?.underlying,
      (undLegId: Optional<string>) =>
        undLegId === undefined
          ? undefined
          : (currentCalculation?.legsById[undLegId] as StratLegStock)
    )(currentCalculation);

export default selectStockLegFromLegId;
