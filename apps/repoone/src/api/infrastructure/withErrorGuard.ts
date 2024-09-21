import { type NextFunction } from "express";
import { type NextApiResponse } from "next";
import l from "../../services/logger";
import { type Controller } from "opc-types/lib/api/Controller";
import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type RequestVars } from "opc-types/lib/api/RequestVars";
import responder from "./responder";

export default function withErrorGuard<T extends RequestVars, U>(
  controller: Controller<T, U>
) {
  return (req: RequestOf<T>, res: NextApiResponse, next: NextFunction) => {
    Promise.resolve(null)
      .then(() => {
        l.debug(`Route called: ${req.method}:${req.path || req.url}`);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return controller(req, res, next);
      })
      .catch((e) => {
        // todo: check for production environment:
        //  - if dev, provide useful details in response
        //  - if prod, suppress cause of error
        //  - if prod, log with error service
        const errMsg = e.message || "An uncaught error occurred.";
        responder(res, errMsg)(e);
      });
  };
}
