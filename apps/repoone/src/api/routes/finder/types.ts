import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type FinderReqParams } from "opc-types/lib/api/requests/FinderReqParams";
import { type FinderResp } from "opc-types/lib/api/responses/FinderResp";

export type ReqParams = FinderReqParams;

export type DTO = {
  symbol: string;
  targetting: string;
  priceFrom?: number;
  priceTo?: number;
  date: string;
  currentPrice: number;
  dataFormat?: "v2";
  budgetCost?: number;
  budgetExclExp: boolean;
  ivHist: string;
  strategies: ObjRecord<boolean>;
  specificExpiry: boolean;
  sortBy?: "ror" | "rorAnn" | "pop" | "popXRor";
};

export type ReturnType = FinderResp;
