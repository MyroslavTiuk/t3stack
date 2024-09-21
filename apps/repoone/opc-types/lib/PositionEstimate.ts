import { PIN_RISK } from './PIN_RISK';

export type PositionEstimateLeg = {
  value: number; // always positive, price is per option
  expiring: boolean;
  pinRisk: PIN_RISK;
};

export type PositionEstimateInitialLeg = {
  value: number; // always positive, price is per option
  act: 'buy' | 'sell';
  num: number;
};

export type PositionEstimateInitial = {
  gross: number;
  contractsPerShare: number;
  legs: Record<string, PositionEstimateInitialLeg>;
};

export type PositionEstimate = {
  gross: number; // Positive means the position is worth money???
  legs: Record<string, PositionEstimateLeg>;
};
