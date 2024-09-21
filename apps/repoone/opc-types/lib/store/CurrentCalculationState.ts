import { Nullable } from "../util/Nullable";

import { Strategy } from "../Strategy";

export type CurrentCalculationState = Nullable<Strategy>;

export interface CurrentCalculationQuickView extends Strategy {
  type: string;
}

export interface MultiStrikeCalculation extends Strategy {
  stage: string;
}
