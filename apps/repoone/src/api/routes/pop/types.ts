import { type StrategyComplete } from "opc-types/lib/Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";

export type ReqParams = {
  body: NonNullable<unknown>;
};

export type ReqParamsV2 = {
  body: {
    stratKey: string;
    "underlying-symbol": string;
    "underlying-curPrice": string;
    "underlying-marketPrice": string;
    "underlying-lastPrice": string;
    "underlying-ivHist": string;
    [k: string]: string;
    // 'option-act': string;
    // 'option-price': string;
    // 'option-curPrice': string;
    // 'option-num': string;
    // 'option-opType': string;
    // 'option-expiry': string;
    // 'option-strike': string;
    // 'option-iv': string;
    "graph-priceMin": string;
    "graph-priceMax": string;
    "graph-rangeAuto": string;
    "graph-type": string;
    "graph-date": string;
    tabId: string;
    reqId: string;
    int_rate: string;
    yield: string;
  };
};

export type DTO = {
  strat: StrategyComplete;
  ivHist: number;
};

export type ReturnType = {
  pop: number;
  pop100: Nullable<number>;
  pop75: Nullable<number>;
  pop50: Nullable<number>;
};
