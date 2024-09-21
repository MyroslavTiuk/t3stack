import { type NextApiResponse as Response } from "next";
import { type RouteDef } from "opc-types/lib/api/RouteDef";
import responder, { responderWithCatch } from "../../infrastructure/responder";
import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type Outcome } from "opc-types/lib/Outcome";
import { ifNotErr } from "errable";

import { type ReqParams, type ReturnType } from "./types";

import { errorFactory } from "../../infrastructure/errorHanding";
import transformBulkCalc from "./transform";
import usecase from "./usecase";
import validateBulkCalc from "./validate";

const bulkCalcRoute: RouteDef<ReqParams, ReturnType> = {
  controller: (
    req: RequestOf<ReqParams>,
    res: Response
  ): Promise<Outcome<ReturnType>> => {
    if (req.method !== "POST") {
      const err = errorFactory("Method not supported");
      responder(res, err.message)(err);
      return Promise.resolve(err);
    }
    const promise = Promise.resolve(req)
      .then(transformBulkCalc)
      // @ts-ignore
      .then(validateBulkCalc)
      .then(ifNotErr(usecase))
      .then(...responderWithCatch(res));
    return promise;
  },
};

export default bulkCalcRoute;
