import { type NextApiResponse as Response } from "next";
import { ifNotErr, ifNotErrAsync } from "errable";
import { type RouteDef } from "opc-types/lib/api/RouteDef";
import { responderWithCatch } from "../../infrastructure/responder";
import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type Outcome } from "opc-types/lib/Outcome";

import { type ReqParams, type ReturnType } from "./types";

import transform from "./transform";
import validate from "./validate";
import usecase from "./usecase";

/**
 * Dev note: This whole section was ported from PHP.  The typing is loose, and coding is out of style.
 *
 * It could use a tidy sometime
 */
const finderRoute: RouteDef<ReqParams, ReturnType> = {
  method: "get",
  controller: (
    req: RequestOf<ReqParams>,
    res: Response
  ): Promise<Outcome<ReturnType>> => {
    return Promise.resolve(req)
      .then(transform)
      .then(ifNotErr(validate))
      .then(ifNotErrAsync(usecase))
      .then(...responderWithCatch(res));
  },
};

export default finderRoute;
