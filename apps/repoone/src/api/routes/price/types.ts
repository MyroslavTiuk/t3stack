import { type PriceDataReqParams } from "opc-types/lib/api/requests/PriceDataReqParams";
import { type PriceDataResp } from "opc-types/lib/api/responses/PriceDataResp";

export type ReqParams = PriceDataReqParams;

export type DTO = {
  symbol: string;
  force: boolean;
};

export type ReturnType = PriceDataResp;
