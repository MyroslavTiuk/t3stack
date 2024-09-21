import { type StratName } from "opc-types/lib/StratName";

import { makeCreateActions, presetActions } from "../../../utils/Redux";

const ns = "ANALYTICS";
const createAnalyticsActions = makeCreateActions(ns);

export interface LegDesc {
  strike: number;
  expiry: string[] | string;
  opType: string;
  act: string;
}

interface CalcParams {
  symbol: string;
  strategy: StratName;
  legs: LegDesc[];
}

const analyticsActions = createAnalyticsActions({
  search: (symb: string) => symb.toUpperCase(),
  basicInteraction: presetActions.makeIdentity<string>(),
  calculation: presetActions.makeIdentity<CalcParams>(),
  revertToOld: presetActions.noPayload,
  signUp: presetActions.noPayload,
  login: presetActions.noPayload,
  toggleLayout: presetActions.makeIdentity<string>(),
});

export default analyticsActions;
