import { type ReduxListener } from "redux-listeners";

import getGTag from "../../../utils/App/getGTag";

import analyticsActions, { type LegDesc } from "../actions/analytics";
import { getPayload } from "./helpers";
import { calculatorActions } from "../actions";

const makeTradeSummary = (legs: LegDesc[]) => {
  return legs
    .sort((legA, legB) => {
      if (legA.strike - legB.strike === 0) {
        if (legA.opType === "call" && legB.opType === "put") return 1;
        if (legA.opType === "put" && legB.opType === "call") return -1;
        return 0;
      }
      return legA.strike - legB.strike;
    })
    .map((leg) => `${leg.act[0]}${leg.opType[0]} ${leg.expiry} ${leg.strike}`)
    .join(" / ");
};

function trackGenericEvent(
  event_category: string,
  action: string,
  event_label?: string
) {
  const gtag = getGTag();
  if (gtag) {
    // https://support.google.com/analytics/answer/9478675
    gtag("event", action, {
      event_category,
      ...(event_label ? { event_label } : {}),
    });
  }
}

let toggleLayoutTimeout: NodeJS.Timeout;

const analyticsListeners: [string | string[], ReduxListener][] = [
  [
    [
      calculatorActions.changeSymbol.toString(),
      analyticsActions.search.toString(),
    ],
    (_dispatch, action) => {
      const payload = getPayload(analyticsActions.search, action);
      if (payload) {
        trackGenericEvent("Symbol search", payload.toLowerCase());
      }
      // GA 4:
      // gtag('event', 'search', { search_term: payload });
    },
  ],
  [
    analyticsActions.calculation.toString(),
    (_dispatch, action) => {
      const payload = getPayload(analyticsActions.calculation, action);
      trackGenericEvent(
        `Calculation: ${payload.strategy || "custom"}`,
        payload.symbol,
        makeTradeSummary(payload.legs)
      );
      /** For GA 4:
       // Dev note: custom event dimensions and metrics must be registered
       gtag('event', 'calculation', {
          symbol: payload.symbol,
          strategy: payload.strategy || 'custom',
          trade: makeTradeSummary(payload.legs),
        }
       */
    },
  ],
  [
    analyticsActions.signUp.toString(),
    () => {
      const gtag = getGTag();
      if (gtag) {
        gtag("event", "sign_up", { method: "email" });
      }
    },
  ],
  [
    analyticsActions.login.toString(),
    () => {
      const gtag = getGTag();
      if (gtag) {
        gtag("event", "login", { method: "email" });
      }
    },
  ],
  [
    analyticsActions.revertToOld.toString(),
    () => {
      const gtag = getGTag();
      if (gtag) {
        gtag("event", "revert_to_old", {});
      }
    },
  ],
  [
    analyticsActions.toggleLayout.toString(),
    (_d, action) => {
      const payload = getPayload(analyticsActions.toggleLayout, action);
      if (toggleLayoutTimeout) {
        clearTimeout(toggleLayoutTimeout);
      }
      toggleLayoutTimeout = setTimeout(() => {
        payload && trackGenericEvent("toggle_layout", payload);
      }, 5000);
    },
  ],
  [
    analyticsActions.basicInteraction.toString(),
    (_d, action) => {
      const payload = getPayload(analyticsActions.basicInteraction, action);
      trackGenericEvent("User Interactions", payload || "unknown");
    },
  ],
];

export default analyticsListeners;
