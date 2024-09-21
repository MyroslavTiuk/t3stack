import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type ReqParams, type DTO } from "./types";
import { type Outcome } from "opc-types/lib/Outcome";
import extractAuthToken from "../../services/auth/extractAuthToken";

export default function transformBulkCalc(
  req: RequestOf<ReqParams>
): Outcome<DTO> {
  return {
    authToken: extractAuthToken(req),
    trades: req.body.trades || [],
  };
}
