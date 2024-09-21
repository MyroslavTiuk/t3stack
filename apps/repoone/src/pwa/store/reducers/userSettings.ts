import * as R from "ramda";

import { type Optional } from "opc-types/lib/util/Optional";
import { type UserSettingsState } from "opc-types/lib/store/UserSettingsState";
import { type StratName } from "opc-types/lib/StratName";
import { type Store } from "opc-types/lib/store/Store";

import { PREFERENCES } from "../../../config/Preferences";
import handleActions, {
  handleActionReducer,
} from "../../../utils/Redux/handleActions/handleActions";
import presetPayloadReducers from "../../../utils/Redux/presetPayloadReducers/presetPayloadReducers";
import authActions from "../actions/auth";
import commonActions from "../actions/common";
import userSettingsActions from "../actions/userSettings";
import { ASYNC_STATUS } from "../../../types/enums/ASYNC_STATUS";
import { calculatorActions } from "../actions";
import { LAYOUT_OPTIONS } from "../../../types/enums/LAYOUT_OPTIONS";
import isOldSiteVisitor from "../../../utils/App/isOldSiteVisitor";
import { initPreviousUserLayout } from "../../../services/Experiments/initExperiments";

const previousUserLayout = initPreviousUserLayout();
const isOldSiteVisitorR = isOldSiteVisitor();
const viewedPreviewExplainer = !isOldSiteVisitorR;
const initialLayout =
  previousUserLayout.indexOf("SBS_") === 0
    ? LAYOUT_OPTIONS.SIDE_BY_SIDE
    : LAYOUT_OPTIONS.STACKED;

export const DEFAULT_USER_SETTINGS_STATE: UserSettingsState = {
  inputMethod: PREFERENCES.DEFAULT_INPUT_METHOD,
  inputMethodMobile: PREFERENCES.DEFAULT_INPUT_METHOD_MOBILE,
  layout: initialLayout, // PREFERENCES.DEFAULT_LAYOUT,
  hasAcceptedTNC: false,
  hasAcceptedCookies: false,
  showStrategyDesc: true,
  stockChangeInValue: true,
  defaultDisplayValueType: PREFERENCES.DEFAULT_DISPLAY_VALUE_TYPE,
  closePriceMethod: PREFERENCES.DEFAULT_CLOSE_PRICE_METHOD,
  legIVMethod: PREFERENCES.DEFAULT_LEG_IV_METHOD,
  timeDecayBasis: PREFERENCES.DEFAULT_TIME_DECAY_BASIS,
  resultsVisualization: PREFERENCES.DEFAULT_RESULTS_VISUALIZATION,
  viewedPreviewExplainer,
  recentStockSymbols: PREFERENCES.DEFAULT_RECENT_STOCKS,
  recentStrategies: [],
  oldCalcSyncStatus: ASYNC_STATUS.INITIAL,
  ftuxStage: 0,
  chainColumns: [],
};

export const NS = "USER_SETTINGS";

const prependedStockValues = (v: string) =>
  R.compose(
    R.take(PREFERENCES.MAX_RECENT_STOCKS),
    R.uniq,
    R.prepend(v.toUpperCase())
  ) as (s: string[]) => string[];

const prependedStrategyValues = (v: string) =>
  R.compose(
    R.take(PREFERENCES.MAX_RECENT_STRATEGIES),
    R.uniq,
    R.prepend(v)
  ) as (s: StratName[]) => StratName[];

const fauxHydrateAction = () => ({
  type: "persist/REHYDRATE",
  payload: undefined as Optional<Store>,
});
fauxHydrateAction.toString = () => "persist/REHYDRATE";

const reducer = handleActions<UserSettingsState>(
  [
    handleActionReducer(commonActions.reset, () => DEFAULT_USER_SETTINGS_STATE),
    handleActionReducer(authActions.logout, (state) => {
      const sharedBrowserSettings = {
        hasAcceptedCookies: state.hasAcceptedCookies,
        hasAcceptedTNC: state.hasAcceptedTNC,
        viewedPreviewExplainer: state.viewedPreviewExplainer,
        oldCalcSyncStatus: state.oldCalcSyncStatus,
      };
      return {
        ...DEFAULT_USER_SETTINGS_STATE,
        ...sharedBrowserSettings,
      };
    }),
    handleActionReducer(
      userSettingsActions.setInputMethod,
      (state, payload) => ({
        ...state,
        inputMethod: payload,
      })
    ),
    handleActionReducer(
      userSettingsActions.setInputMethodMobile,
      presetPayloadReducers.makePropSetter("inputMethodMobile")
    ),
    handleActionReducer(
      userSettingsActions.setHasAcceptedTNC,
      (state, payload) => ({
        ...state,
        hasAcceptedTNC: payload,
      })
    ),
    handleActionReducer(
      userSettingsActions.setHasAcceptedCookies,
      (state, payload) => ({
        ...state,
        hasAcceptedCookies: payload,
      })
    ),
    handleActionReducer(
      userSettingsActions.setShowStrategyDesc,
      (state, payload) => ({
        ...state,
        showStrategyDesc: payload,
      })
    ),
    handleActionReducer(
      userSettingsActions.setDefaultDisplayValueType,
      (state, payload) => ({
        ...state,
        defaultDisplayValueType: payload,
      })
    ),
    handleActionReducer(
      userSettingsActions.setClosePriceMethod,
      (state, payload) => ({
        ...state,
        closePriceMethod: payload,
      })
    ),
    handleActionReducer(
      userSettingsActions.setUserSettings,
      presetPayloadReducers.makeSetter<UserSettingsState>()
    ),
    handleActionReducer(
      userSettingsActions.setResultsVisualization,
      (state, payload) => ({
        ...state,
        resultsVisualization: payload,
      })
    ),
    handleActionReducer(calculatorActions.changeSymbol, (state, payload) => {
      return {
        ...state,
        recentStockSymbols: prependedStockValues(payload)(
          state.recentStockSymbols
        ),
      };
    }),
    handleActionReducer(
      userSettingsActions.addRecentStrategy,
      (state, payload) => {
        return {
          ...state,
          recentStrategies: prependedStrategyValues(payload)(
            state.recentStrategies
          ),
        };
      }
    ),
    handleActionReducer(
      userSettingsActions.acknowledgePreviewExplainer,
      (state) => ({
        ...state,
        viewedPreviewExplainer: true,
      })
    ),
    handleActionReducer(
      userSettingsActions.setOldCalcSyncStatus,
      (state, payload) => ({
        ...state,
        oldCalcSyncStatus: payload,
      })
    ),
    handleActionReducer(
      userSettingsActions.setLayout,
      presetPayloadReducers.makePropSetter("layout")
    ),
    handleActionReducer(
      userSettingsActions.setChainColumns,
      presetPayloadReducers.makePropSetter("chainColumns")
    ),
    handleActionReducer(
      userSettingsActions.setFtuxStage,
      (state, val: number) => {
        return {
          ...state,
          ftuxStage: state.ftuxStage | val,
        };
      }
    ),
  ],
  DEFAULT_USER_SETTINGS_STATE
);

export default reducer;
