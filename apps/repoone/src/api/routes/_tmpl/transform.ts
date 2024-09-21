import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type ReqParams, type DTO } from "./types";
import { type Outcome } from "opc-types/lib/Outcome";

export default function transform(_: RequestOf<ReqParams>): Outcome<DTO> {
  return {};
}
