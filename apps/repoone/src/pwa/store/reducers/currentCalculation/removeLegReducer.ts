import legsWithIds from "../../../../pwa/store/selectors/currentCalculation/legsWithIds";
import filterOptionLegs from "../../../../pwa/store/selectors/currentCalculation/filterOptionLegs";
import { type StratName } from "opc-types/lib/StratName";
import { omit } from "ramda";
import strategyDefs from "../../../../model/strategyDefs";
import { type CurrentCalculationState } from "opc-types/lib/store/CurrentCalculationState";
import type calculatorActions from "../../../../pwa/store/actions/calculator";

const removeLegReducer = (
  state: CurrentCalculationState,
  { payload }: ReturnType<typeof calculatorActions.removeLeg>
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const legSize = legsWithIds(filterOptionLegs(state)).length;
  if (legSize === 0) {
    return state;
  }
  const stratName = <StratName>"custom";
  const newLegs = state?.legs.filter((item) => item !== payload);
  const newLegsById = omit([payload], state?.legsById);
  const newStratDef = omit(["legsById"], strategyDefs[stratName]);

  const newState = {
    ...state,
    ...newStratDef,
    legs: newLegs,
    legsById: newLegsById,
  } as CurrentCalculationState;

  return newState;
};

export default removeLegReducer;
