import { StrategyDef, Strategy } from './Strategy';
import { StratName } from './StratName';

export type StrategiesDef = Record<StratName, StrategyDef>;

export type Strategies = Record<StratName, Strategy>;
