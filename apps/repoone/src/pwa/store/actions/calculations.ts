import { makeCreateActions, presetActions } from "../../../utils/Redux";
import { type StrategyComplete } from "opc-types/lib/Strategy";

const ns = "CALCULATIONS";
const createCalcsActions = makeCreateActions(ns);

const calculationsActions = createCalcsActions({
  upsert: presetActions.makeIdentity<StrategyComplete>(),
  setAll: presetActions.makeIdentity<StrategyComplete[]>(),
  appendAll: presetActions.makeIdentity<StrategyComplete[]>(),
  reset: presetActions.noPayload,
  delete: presetActions.makeIdentity<string>(),
});

export default calculationsActions;
