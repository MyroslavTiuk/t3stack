import { CLOSE_PRICE_METHODS } from '../types/enums/CLOSE_PRICE_METHODS';
import { COVERED_STRATEGIES } from '../types/enums/COVERED_STRATEGIES';
import { LEG_IV_METHOD } from '../types/enums/LEG_IV_METHOD';
import { TIME_DECAY_BASIS } from '../types/enums/TIME_DECAY_BASIS';

export type CTOPair = [CLOSE_PRICE_METHODS, string];

export const closePriceMethodOptions: CTOPair[] = [
  [CLOSE_PRICE_METHODS.MARKET, 'Market Price'],
  [CLOSE_PRICE_METHODS.MID, 'Theoretical / Mid Price'],
];

export type Leg4PairEsimationPair = [LEG_IV_METHOD, string];

export const legIVMethodOptions: Leg4PairEsimationPair[] = [
  [LEG_IV_METHOD.STICKY_TO_SPOT, 'IV sticky to spot'],
  [LEG_IV_METHOD.STICKY_TO_STRIKE, 'IV sticky to strike'],
];

export type TimeDecayBasisPair = [TIME_DECAY_BASIS, string];

export const timeDecayBasisOptions: TimeDecayBasisPair[] = [
  [TIME_DECAY_BASIS.CALENDAR_DAYS, 'Include Non-Trading Days'],
  [TIME_DECAY_BASIS.TRADING_DAYS, 'Trading days only'],
];

export type CoveredStrategiesPair = [COVERED_STRATEGIES, string];

export const coveredStrategiesOptions: CoveredStrategiesPair[] = [
  [COVERED_STRATEGIES.SHOW_CHANGE_IN_STOCK_VALUE, 'Change in stock value only'],
  [
    COVERED_STRATEGIES.WITH_PURCHASE_OR_SALES_STOCK,
    'Include purchase & sale of stocks',
  ],
];
