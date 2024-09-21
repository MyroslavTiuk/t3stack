import Cors from "cors";

import { type NextApiResponse } from "next";
import { type NextFunction } from "express";

import { type Controller } from "opc-types/lib/api/Controller";
import { type RequestOf } from "opc-types/lib/api/RequestOf";
import Env from "../../config/Env";
import { type RequestVars } from "opc-types/lib/api/RequestVars";
import l from "~/services/logger";

export function makeWithCors<T extends RequestVars, U>(
  corsParams: Cors.CorsOptions
) {
  const cors = Cors(corsParams);

  return (controller: Controller<T, U>): Controller<T, U> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (req: RequestOf<T>, res: NextApiResponse, next: NextFunction) =>
      cors(req as any, res as never, (result: any) => {
        if (result instanceof Error) return next(result);
        return controller(req, res, next);
      });
  };
}

export function withDefaultCors<T extends RequestVars, U>(
  controller: Controller<T, U>
) {
  const { IS_DEV } = Env;

  l.info(`Environment: ${IS_DEV}`);

  return makeWithCors<T, U>({
    methods: ["GET", "POST"],
    origin: [
      /https?:\/\/www\.optionsprofitcalculator\.com/i,
      /https?:\/\/www\.optionsprofitcalculator\.local/i,
      /https?:\/\/dev\.optionsprofitcalculator\.com/i,
      /https?:\/\/chillon\.optionsprofitcalculator\.com/i,
      /https?:\/\/preview\.optionsprofitcalculator\.com/i,
      /https?:\/\/alpha-388\.optionsprofitcalculator\.com/i,
      /https?:\/\/beta\.optionsprofitcalculator\.com/i,
      /https?:\/\/new\.optionsprofitcalculator\.com/i,
      /https?:\/\/old\.optionsprofitcalculator\.com/i,
      /https?:\/\/opcalc-excel\.surge\.sh/i,
      /https?:\/\/opcalc-excel-stg\.surge\.sh/i,
    ].concat(
      IS_DEV
        ? [
            /https?:\/\/localhost/i,
            /https?:\/\/localhost:8080/i,
            /https?:\/\/localhost:3000/i,
            /https?:\/\/10\.1\.1\.155:3000/i,
          ]
        : []
    ),
  })(controller);
}
