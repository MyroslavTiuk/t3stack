import { Strategy } from './Strategy';

type SOKeys = 'id' | 'title';

export type StrategyOverview = Pick<Strategy, SOKeys> & {
  symbol: string;
  isDraft?: boolean;
  stratKey: string;
};

export type StrategyOverviewWithCalculation = StrategyOverview & {
  calculation: Strategy;
};
