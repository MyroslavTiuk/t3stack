import { type UserSettings } from "opc-types/lib/UserSettings";
import { DEFAULT_USER_SETTINGS_STATE } from "../../../../store/reducers/userSettings";
import ifUndef from "../../../../../utils/Data/ifUndef/ifUndef";
import { ASYNC_STATUS } from "../../../../../types/enums/ASYNC_STATUS";

const ensureUserSettings = (foreignUserSettings: any): UserSettings => {
  return {
    closePriceMethod: ifUndef(
      foreignUserSettings.closePriceMethod,
      DEFAULT_USER_SETTINGS_STATE.closePriceMethod
    ),
    inputMethodMobile: ifUndef(foreignUserSettings.inputMethodMobile, "inline"),
    defaultDisplayValueType: ifUndef(
      foreignUserSettings.defaultDisplayValueType,
      DEFAULT_USER_SETTINGS_STATE.defaultDisplayValueType
    ),
    hasAcceptedTNC: ifUndef(
      foreignUserSettings.hasAcceptedTNC,
      DEFAULT_USER_SETTINGS_STATE.hasAcceptedTNC
    ),
    inputMethod: ifUndef(
      foreignUserSettings.inputMethod,
      DEFAULT_USER_SETTINGS_STATE.inputMethod
    ),
    showStrategyDesc: ifUndef(
      foreignUserSettings.showStrategyDesc,
      DEFAULT_USER_SETTINGS_STATE.showStrategyDesc
    ),
    stockChangeInValue: ifUndef(
      foreignUserSettings.stockChangeInValue,
      DEFAULT_USER_SETTINGS_STATE.stockChangeInValue
    ),
    legIVMethod: ifUndef(
      foreignUserSettings.legIVMethod,
      DEFAULT_USER_SETTINGS_STATE.legIVMethod
    ),
    timeDecayBasis: ifUndef(
      foreignUserSettings.timeDecayBasis,
      DEFAULT_USER_SETTINGS_STATE.timeDecayBasis
    ),
    resultsVisualization: ifUndef(
      foreignUserSettings.resultsVisualization,
      DEFAULT_USER_SETTINGS_STATE.resultsVisualization
    ),
    viewedPreviewExplainer: ifUndef(
      foreignUserSettings.viewedPreviewExplainer,
      DEFAULT_USER_SETTINGS_STATE.viewedPreviewExplainer
    ),
    recentStockSymbols: ifUndef(
      foreignUserSettings.recentStockSymbols,
      DEFAULT_USER_SETTINGS_STATE.recentStockSymbols
    ),
    recentStrategies: ifUndef(
      foreignUserSettings.recentStrategies,
      DEFAULT_USER_SETTINGS_STATE.recentStrategies
    ),
    hasAcceptedCookies: ifUndef(
      foreignUserSettings.hasAcceptedCookies,
      DEFAULT_USER_SETTINGS_STATE.hasAcceptedCookies
    ),
    oldCalcSyncStatus: ifUndef(
      foreignUserSettings.oldCalcSyncStatus,
      ASYNC_STATUS.COMPLETE
    ),
    layout: ifUndef(
      foreignUserSettings.layout,
      DEFAULT_USER_SETTINGS_STATE.layout
    ),
    ftuxStage: ifUndef(foreignUserSettings.ftuxStage, 0),
    chainColumns: ifUndef(foreignUserSettings.chainColumns, []),
  };
};

export default ensureUserSettings;
