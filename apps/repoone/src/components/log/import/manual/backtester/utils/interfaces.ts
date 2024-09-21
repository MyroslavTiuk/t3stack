import { type RefetchOptions } from "@tanstack/react-query";

export interface IExternalStrategies {
  strategyName: string;
  strategyType: string;
  strategyMode: string;
  strategyValue: number;
  strategyQuantity: number;
}
export interface IExternalStrategiesForm {
  strategyName?: string;
  strategyType?: string;
  strategyMode?: string;
  strategyValue?: number;
  strategyQuantity?: number;
}
export interface RefetchOptionsWithSymbols extends RefetchOptions {
  symbols: string[];
}
export interface ICriterias {
  positionCriteria?: string;
  positionValue?: number;
}
