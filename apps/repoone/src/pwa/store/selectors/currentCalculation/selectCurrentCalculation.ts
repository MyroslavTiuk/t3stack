import { view, lensProp } from "ramda";

import { type Store } from "opc-types/lib/store/Store";
import { type CurrentCalculationState } from "opc-types/lib/store/CurrentCalculationState";

const selectCurrentCalculation = view<Store, CurrentCalculationState>(
  lensProp("currentCalculation")
);

export default selectCurrentCalculation;
