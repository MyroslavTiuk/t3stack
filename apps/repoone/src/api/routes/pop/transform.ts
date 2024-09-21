import { pipe, always } from "ramda";

import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type ReqParamsV2, type DTO } from "./types";
import { type Outcome } from "opc-types/lib/Outcome";
import convertV2calc from "../../../utils/Data/TransformStrategy/convertV2calc";
import { fromNull, ifNotErr, withNotErr } from "errable";
import isStrategyComplete from "../../../utils/Finance/isStrategyComplete";
import { errorFactory } from "../../infrastructure/errorHanding";

export function transformV2(req: RequestOf<ReqParamsV2>): Outcome<DTO> {
  return pipe(
    always(req.body),
    (vars) => ({
      strat: vars.stratKey,
      vars,
    }),
    convertV2calc,
    fromNull(errorFactory("Could not convert strategy")),
    ifNotErr((s) =>
      isStrategyComplete(s) ? s : errorFactory("Strategy incomplete")
    ),
    withNotErr((strat) => ({
      strat,
      ivHist: req.body["underlying-ivHist"]
        ? parseFloat(req.body["underlying-ivHist"])
        : 0,
    }))
  )();
}
