import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type ReqParams, type DTO } from "./types";
import { type Outcome } from "opc-types/lib/Outcome";
import { type Strategy } from "opc-types/lib/Strategy";

export default function transform(req: RequestOf<ReqParams>): Outcome<DTO> {
  // todo: Check calculation is valid
  return {
    calculation: req.body.calculation || ({} as Strategy),
    token: req.body.token || "",
  };
}
