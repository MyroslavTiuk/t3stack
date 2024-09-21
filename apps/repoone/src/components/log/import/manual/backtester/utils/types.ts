export type entryCriteriaType =
  | `entryCriteria.${number}.positionCriteria`
  | `entryCriteria.${number}.positionValue`;
export type exitAndCriteriaType =
  | `exitAndCriteria.${number}.positionCriteria`
  | `exitAndCriteria.${number}.positionValue`;
export type exitOrCriteriaType =
  | `exitOrCriteria.${number}.positionCriteria`
  | `exitOrCriteria.${number}.positionValue`;
export type StrategyFieldName =
  | `strategies.${number}.strategyMode`
  | `strategies.${number}.strategyValue`
  | `strategies.${number}.strategyQuantity`;
