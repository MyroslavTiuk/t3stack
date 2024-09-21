import { NumberOrInfinity } from '../../util/NumberOrInfinity';
import { Nullable } from '../../util/Nullable';

export type FinderOutcome = {
  roiMaxRisk: number;
  vars: any; //[string, string, string, string, PositionEstimateInitial, PositionEstimate],
  net: number;
  gross: number;
  init: number;
  maxRisk: NumberOrInfinity;
  netMargin: Nullable<number>;
  grossMargin: Nullable<number>;
  roiMargin: number;
  pop: Nullable<number>;
};

export type FinderResp = {
  outcomes: FinderOutcome[];
  runLength: number;
};
