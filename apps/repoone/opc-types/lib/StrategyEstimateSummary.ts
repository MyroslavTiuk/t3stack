import { NumberOrInfinity } from './util/NumberOrInfinity';
import { Nullable } from './util/Nullable';
import { ObjRecord } from './util/ObjRecord';

export type StrategyEstimateSummary = {
  maxReturn: NumberOrInfinity;
  maxReturnPrice: [number, number][];
  maxRisk: NumberOrInfinity;
  maxRiskPrice: [number, number][];
  maxRisk1SD: Nullable<number>;
  maxRisk2SD: Nullable<number>;
  maxRisk1SDprice: Nullable<[number, number][]>;
  maxRisk2SDprice: Nullable<[number, number][]>;
  // maxRisk1SDpriceRel: Nullable<number>;
  // maxRisk2SDpriceRel: Nullable<number>;
  prices1SD: Nullable<ObjRecord<number>>;
  prices2SD: Nullable<ObjRecord<number>>;
  pop: Nullable<number>;
  pop50: Nullable<number>;
  pop75: Nullable<number>;
  pop100: Nullable<number>;
  breakevens: [number, number][]; // !todo
  collateral: Nullable<number>;
  roiCollateral: Nullable<NumberOrInfinity>;
};
