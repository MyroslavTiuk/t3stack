import { assoc } from "ramda";

import { type NextFunction } from "express";
import { type NextApiResponse } from "next";
import { type Controller } from "opc-types/lib/api/Controller";
import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type RequestVars } from "opc-types/lib/api/RequestVars";

export default function withParseBody<T extends RequestVars, U>(
  controller: Controller<T, U>
) {
  return (req: RequestOf<T>, res: NextApiResponse, next: NextFunction) => {
    let bodyData = null;
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore (catching it)
      bodyData = req.body ? JSON.parse(req.body) : null;
    } catch (e) {
      bodyData = null;
    }
    const newReq = assoc("body", bodyData, req);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return controller(newReq, res, next);
  };
}
