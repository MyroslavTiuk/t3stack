import { type NextApiResponse as Response } from "next";
import { type RouteDef } from "opc-types/lib/api/RouteDef";
import { responderWithCatch } from "../../infrastructure/responder";
import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type ReqParams, type ReturnType } from "./types";

import transform from "./transform";
import usecase from "./usecase";
import { type t } from "opc-types/lib";

const priceRoute: RouteDef<ReqParams, ReturnType> = {
  method: "get",
  controller: (
    req: RequestOf<ReqParams>,
    res: Response
  ): Promise<t.Outcome<ReturnType>> => {
    return Promise.resolve(req)
      .then(transform)
      .then(usecase)
      .then(...responderWithCatch(res));
  },
};

export default priceRoute;
