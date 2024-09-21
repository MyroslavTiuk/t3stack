import { PositionEstimate, PositionEstimateInitial } from './PositionEstimate';
import { StrategyEstimateSummary } from './StrategyEstimateSummary';

type NumberStr = string;
type PricePoint = NumberStr;
type YYYYMMDD = string;
export type TheoPoints = Record<PricePoint, Record<YYYYMMDD, PositionEstimate>>;
export type StrategyEstimate = {
  initial: PositionEstimateInitial;
  theoPoints: TheoPoints;
  summary: StrategyEstimateSummary;
  // startDate: string;
};
