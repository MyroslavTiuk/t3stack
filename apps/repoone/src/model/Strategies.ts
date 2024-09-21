import { type StratName } from "opc-types/lib/StratName";
import { type StratMenu } from "opc-types/lib/StratMenu";
import TransformStrategy from "../utils/Data/TransformStrategy/TransformStrategy";
import { type StrategiesDef } from "opc-types/lib/Strategies";
import { type Strategy, type StrategyDef } from "opc-types/lib/Strategy";
import strategyDefs from "./strategyDefs";

export default {
  getStrategies: (): StrategiesDef => strategyDefs,
  getStrategyMenu: (): StratMenu =>
    TransformStrategy.stratsToStratMenu(strategyDefs),
  // todo: maybe pipe through fillDefaults
  getStrategy: (strat: StratName): StrategyDef => strategyDefs[strat],
  getStrategyFilled: (strat: StratName): Strategy =>
    TransformStrategy.stratToInitialState(strategyDefs[strat]),
};
