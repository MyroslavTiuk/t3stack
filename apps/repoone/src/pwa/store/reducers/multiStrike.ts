import { handleActions } from "redux-actions";
import { MultiStrikeCalculation } from "../../../../opc-types/lib/store/CurrentCalculationState";
import calcActions from "~/pwa/store/actions/calculator";

const DEFAULT_STATE: MultiStrikeCalculation[] = [];

const strikeStages = ["A", "B", "C", "D", "E"];

const reducer = handleActions<MultiStrikeCalculation[], any>(
  {
    [String(calcActions.addStrike)]: (state, { payload }) => {
      return [...state, payload];
    },
    [String(calcActions.setStrikes)]: (state, { payload }) => {
      return payload;
    },
    [String(calcActions.removeStrike)]: (state, { payload }) => {
      return (
        state
          // @ts-ignore
          .filter((ms) => ms.legsById.option.strike !== payload)
          .map((ms, i) => ({
            ...ms,
            stage: strikeStages[i],
          }))
      );
    },
    [String(calcActions.replaceLastStrike)]: (state, { payload }) => {
      const newMultiStrike = [...state];
      newMultiStrike[state.length - 1] = payload;
      return newMultiStrike;
    },
    [String(calcActions.resetMultiStrikes)]: (_) => {
      return [];
    },
  },
  DEFAULT_STATE
);

export default reducer;
