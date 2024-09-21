import { type NextApiResponse as Response } from "next";
import { type RouteDef } from "opc-types/lib/api/RouteDef";
import { responderWithCatch } from "../../infrastructure/responder";
import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type Outcome } from "opc-types/lib/Outcome";

import { type ReqParamsV2, type ReturnType } from "./types";

import { transformV2 } from "./transform";
import usecase from "./usecase";
import { ifNotErrAsync } from "errable";

const popRoute: RouteDef<ReqParamsV2, ReturnType> = {
  controller: (
    req: RequestOf<ReqParamsV2>,
    res: Response
  ): Promise<Outcome<ReturnType>> => {
    const promise = Promise.resolve(req)
      .then(transformV2)
      .then(ifNotErrAsync(usecase))
      .then(...responderWithCatch(res));
    return promise;
  },
};

export default popRoute;
