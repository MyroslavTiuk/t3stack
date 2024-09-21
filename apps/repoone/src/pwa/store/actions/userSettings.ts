import { type UserSettings } from "opc-types/lib/UserSettings";
import { type StratName } from "opc-types/lib/StratName";
import { type ASYNC_STATUS } from "opc-types/lib/store/ASYNC_STATUS";

import { makeCreateActions, presetActions } from "../../../utils/Redux";
import { makeTxfnActionCreator } from "../../../utils/Redux/ReduxTxfn/redux-txfn";

export const NS = "USER_SETTINGS";

const createActions = makeCreateActions(NS);

const txfn = makeTxfnActionCreator<UserSettings>(NS);

const userSettingsActions = {
  txfn,
  ...createActions({
    setInputMethod: presetActions.makeIdentity<UserSettings["inputMethod"]>(),
    setInputMethodMobile:
      presetActions.makeIdentity<UserSettings["inputMethodMobile"]>(),
    setLayout: presetActions.makeIdentity<UserSettings["layout"]>(),
    setDefaultDisplayValueType:
      presetActions.makeIdentity<UserSettings["defaultDisplayValueType"]>(),
    setShowStrategyDesc:
      presetActions.makeIdentity<UserSettings["showStrategyDesc"]>(),
    setHasAcceptedTNC:
      presetActions.makeIdentity<UserSettings["hasAcceptedTNC"]>(),
    setHasAcceptedCookies:
      presetActions.makeIdentity<UserSettings["hasAcceptedCookies"]>(),
    setClosePriceMethod:
      presetActions.makeIdentity<UserSettings["closePriceMethod"]>(),
    setResultsVisualization:
      presetActions.makeIdentity<UserSettings["resultsVisualization"]>(),
    setOldCalcSyncStatus: presetActions.makeIdentity<ASYNC_STATUS>(),
    addRecentStockSymbol: presetActions.makeIdentity<string>(),
    addRecentStrategy: presetActions.makeIdentity<StratName>(),
    setUserSettings: presetActions.makeIdentity<UserSettings>(),
    setFtuxStage: presetActions.makeIdentity<number>(),
    setChainColumns: presetActions.makeIdentity<string[]>(),
    acknowledgePreviewExplainer: presetActions.noPayload,
  }),
};

export default userSettingsActions;
