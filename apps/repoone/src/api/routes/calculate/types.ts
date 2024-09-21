import { type Strategy, type StrategyComplete } from "opc-types/lib/Strategy";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";

export type ReqParams = {
  body: {
    calculation: Strategy;
    token: string;
  };
};

export type DTO = {
  calculation: Strategy;
  token: string;
};

export type DTOValidated = {
  calculation: StrategyComplete;
};

export type ReturnType = {
  estimate: StrategyEstimate;
};
