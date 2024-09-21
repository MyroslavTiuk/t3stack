import {
  type ReduxListener,
  type ReduxListenerMiddleware,
} from "redux-listeners";
import analyticsListeners from "./analytics";
import onHydrateListeners from "./onHydrate";
import pricingListeners from "./pricing";

const initListeners = (listenerMiddleware: ReduxListenerMiddleware): void => {
  const allListeners = ([] as [string | string[], ReduxListener][])
    .concat(analyticsListeners)
    .concat(onHydrateListeners)
    .concat(pricingListeners);
  allListeners.forEach(([actionTypes, listener]) => {
    const allActionTypes =
      typeof actionTypes === "string" ? [actionTypes] : actionTypes;
    allActionTypes.forEach((actionType) => {
      listenerMiddleware.addListener(actionType, listener);
    });
  });
};

export default initListeners;
