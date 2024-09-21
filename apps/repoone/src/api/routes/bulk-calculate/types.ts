import { type Optional } from "opc-types/lib/util/Optional";
import { type StrategyEstimate } from "../../../../opc-types/lib/StrategyEstimate";
import { type Outcome } from "../../../../opc-types/lib/Outcome";
import { type MATRIX_TIME_GRANULARITY } from "src/services/calculate/strategyEstimates";

export type SingleOptionCalc = {
  stock: {
    symbol: string;
    priceBid: number | null;
    priceAsk: number | null;
    priceLast: number | null;
    priceUpdated: number;
  };
  option: {
    type: "call" | "put";
    iv: number;
    strike: number;
    expiry: string;
    contracts: number;
    price: number;
  };
  priceRange: [number | null, number | null];
  timeOfCalculation: number;
  granularity: MATRIX_TIME_GRANULARITY;
};

export type ReqParams = {
  body: {
    trades: SingleOptionCalc[];
  };
  headers: {
    authorization: string;
  };
};

export type DTO = {
  authToken: Optional<string>;
  trades: SingleOptionCalc[];
};

export type DTOValidated = {
  trades: SingleOptionCalc[];
};

export type ReturnType = {
  results: Outcome<StrategyEstimate>[];
};
