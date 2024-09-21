import { type NextApiResponse as Response } from "next";
import { type RouteDef } from "opc-types/lib/api/RouteDef";
import responder from "../../infrastructure/responder";
import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type ReqVars, type ReturnType } from "./types";
import { type t } from "opc-types/lib";

const healthCheck: RouteDef<ReqVars, ReturnType> = {
  method: "get",
  controller: (
    _req: RequestOf<ReqVars>,
    res: Response
  ): t.Outcome<ReturnType> => {
    const status = "ok";
    const ret: ReturnType = {
      status,
    };
    return responder(res)(ret);
  },
};

export default healthCheck;
