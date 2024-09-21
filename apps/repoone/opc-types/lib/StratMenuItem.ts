import { StrategyDef } from './Strategy';

export type StratMenuItem = {
  access: StrategyDef['settings']['access'];
  category: StrategyDef['metadata']['category'];
  stratKey: StrategyDef['metadata']['stratKey'];
  menuVisibility?: StrategyDef['metadata']['menuVisibility'];
} & Pick<StrategyDef, 'title' | 'titleShort'>;
