import { handleActions } from "redux-actions";
import calcActions from "~/pwa/store/actions/calculator";

const DEFAULT_STATE = false;

const reducer = handleActions<boolean, any>(
  {
    [String(calcActions.toggleMultiStrike)]: (state) => {
      return !state;
    },

    [String(calcActions.setMultiStrike)]: (_state, { payload }) => {
      return payload;
    },
  },
  DEFAULT_STATE
);

export default reducer;
