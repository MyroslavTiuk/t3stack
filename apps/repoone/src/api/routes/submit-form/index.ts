import { type NextApiResponse as Response } from "next";
import { type RouteDef } from "opc-types/lib/api/RouteDef";
import { ifNotErrAsync } from "errable";

import { responderWithCatch } from "../../infrastructure/responder";

import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type Outcome } from "opc-types/lib/Outcome";

import { type ReqParams, type ReturnType } from "./types";
import transform from "./transform";
import usecase from "./usecase";

const contactRoute: RouteDef<ReqParams, ReturnType> = {
  controller: (
    req: RequestOf<ReqParams>,
    res: Response
  ): Promise<Outcome<ReturnType>> => {
    const promise = Promise.resolve(req)
      .then(transform)
      .then(ifNotErrAsync(usecase))
      .then(...responderWithCatch(res));
    return promise;
  },
};

export default contactRoute;
