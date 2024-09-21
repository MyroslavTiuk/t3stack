import type calculationsActions from "../../../../pwa/store/actions/calculations";
import { type CurrentCalculationState } from "opc-types/lib/store/CurrentCalculationState";

const deleteReducer = (
  state: CurrentCalculationState,
  { payload }: ReturnType<typeof calculationsActions.delete>
) => {
  if (payload === state?.id) {
    return null;
  }
  return state;
};

export default deleteReducer;
