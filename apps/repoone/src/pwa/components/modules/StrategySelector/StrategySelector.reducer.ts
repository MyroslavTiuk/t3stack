import { type State } from "./StrategySelector.props";
import { handleActions } from "redux-actions";
import { combineReducers } from "redux";
import { presetReducers } from "../../../../utils/Redux";

const searchTerm = handleActions<State["searchTerm"], any>(
  {
    SEARCH_UPDATE: presetReducers.makeSetter<string>(),
  },
  ""
);

export default combineReducers({
  searchTerm,
});
