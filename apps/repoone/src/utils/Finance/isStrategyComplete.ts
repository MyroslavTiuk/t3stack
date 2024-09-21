import { mergeRight } from "ramda";

import { type Strategy, type StrategyComplete } from "opc-types/lib/Strategy";
import { isErr } from "errable";
import validateStrategy from "./validateStrategy";

interface Cfg {
  checkTimeOfCalculation: boolean;
}
const defaultCfg = {
  checkTimeOfCalculation: true,
};

const isStrategyComplete = (
  strat: Strategy,
  partialCfg: Partial<Cfg> = {}
): strat is StrategyComplete => {
  const cfg = mergeRight(defaultCfg, partialCfg);
  if (cfg.checkTimeOfCalculation && !strat.timeOfCalculation) return false;
  return !isErr(validateStrategy(strat));
};

export default isStrategyComplete;
