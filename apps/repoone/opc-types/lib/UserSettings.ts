import { CLOSE_PRICE_METHODS } from './CLOSE_PRICE_METHODS';
import { LEG_IV_METHOD } from './LEG_IV_METHOD';
import { RESULTS_VISUALIZATION } from './RESULTS_VISUALIZATION';
import { TIME_DECAY_BASIS } from './TIME_DECAY_BASIS';
import { DisplayValueTypes } from './DisplayValueTypes';
import { StratName } from './StratName';
import { ASYNC_STATUS } from './store/ASYNC_STATUS';
import { LAYOUT_OPTIONS } from './LAYOUT_OPTIONS';
import { INPUT_METHODS } from './INPUT_METHODS';

export interface UserSettings {
  inputMethod: INPUT_METHODS;
  inputMethodMobile: INPUT_METHODS;
  layout: LAYOUT_OPTIONS;
  hasAcceptedTNC: boolean;
  hasAcceptedCookies: boolean;
  showStrategyDesc: boolean;
  stockChangeInValue: boolean;
  defaultDisplayValueType: DisplayValueTypes;
  legIVMethod: LEG_IV_METHOD;
  closePriceMethod: CLOSE_PRICE_METHODS;
  timeDecayBasis: TIME_DECAY_BASIS;
  resultsVisualization: RESULTS_VISUALIZATION;
  viewedPreviewExplainer: boolean;
  recentStockSymbols: string[];
  recentStrategies: StratName[];
  oldCalcSyncStatus: ASYNC_STATUS;
  chainColumns: string[];
  ftuxStage: number;
}
