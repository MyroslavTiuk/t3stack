import { type NextApiResponse as Response } from "next";
import { type RouteDef } from "opc-types/lib/api/RouteDef";
import { responderWithCatch } from "../../infrastructure/responder";
import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type Outcome } from "opc-types/lib/Outcome";

import { type ReqParams, type ReturnType } from "./types";

import transform from "./transform";
import validate from "./validate";
import usecase from "./usecase";
import { ifNotErr } from "errable";

const calculateRoute: RouteDef<ReqParams, ReturnType> = {
  method: "post",
  controller: (
    req: RequestOf<ReqParams>,
    res: Response
  ): Promise<Outcome<ReturnType>> => {
    const promise = Promise.resolve(req)
      .then(transform)
      .then(ifNotErr(validate))
      .then(ifNotErr(usecase))
      .then(...responderWithCatch(res));
    return promise;
  },
};

export default calculateRoute;
