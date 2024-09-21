import { lensPath, set } from "ramda";
import type calculatorActions from "../../../../pwa/store/actions/calculator";
import { isNull } from "errable";
import { type Tuple } from "opc-types/lib/Tuple";
import filterOptionLegs from "../../../../pwa/store/selectors/currentCalculation/filterOptionLegs";
import adjustLegPricesFromSpreadPrice from "../../../../pwa/store/reducers/helpers/adjustLegPricesFromSpreadPrice";
import legsWithIds from "../../../../pwa/store/selectors/currentCalculation/legsWithIds";
import { type CurrentCalculationState } from "opc-types/lib/store/CurrentCalculationState";

const updateSpreadPriceReducer = (
  state: CurrentCalculationState,
  { payload }: ReturnType<typeof calculatorActions.updateSpreadPrice>
) => {
  if (
    isNull(payload.spreadPriceRange[0]) ||
    isNull(payload.spreadPriceRange[1]) ||
    isNull(state)
  ) {
    return state;
  }
  const defSpreadPriceRange = payload.spreadPriceRange as Tuple<number>;
  const opLegs = filterOptionLegs(state);
  const newPrices = adjustLegPricesFromSpreadPrice(
    opLegs,
    payload.spreadPrice,
    defSpreadPriceRange
  );

  const updatedState = legsWithIds(opLegs).reduce((updatedCalc, legsWithId) => {
    const newPrice = newPrices[legsWithId.legId];
    return !newPrice
      ? updatedCalc
      : set(
          lensPath(["legsById", legsWithId.legId, "price"]),
          newPrice,
          updatedCalc
        );
  }, state);

  return updatedState;
};

export default updateSpreadPriceReducer;
