import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type ReqParams, type DTO } from "./types";

export default function transform(req: RequestOf<ReqParams>): DTO {
  let symbol = "";

  if (req.params) {
    if (req.params.symbol) {
      symbol = req.params.symbol.toUpperCase();
    }
  }

  if (req.query) {
    if (req.query.symbol) {
      symbol = req.query.symbol.toUpperCase();
    }
  }

  return {
    symbol: symbol,
    force: Boolean(req?.query?.force || false),
  };
}
