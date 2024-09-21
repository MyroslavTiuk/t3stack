import { pipe } from "ramda";
import { ifNotErr, withErr } from "errable";

import { type Outcome } from "opc-types/lib/Outcome";
import { strategyEstimates } from "../../../services/calculate/strategyEstimates";
import { TIME_DECAY_BASIS } from "../../../types/enums/TIME_DECAY_BASIS";
import { errorFactory } from "../../infrastructure/errorHanding";

import { type DTO, type ReturnType } from "./types";

const getPopRoute = async (dto: DTO): Promise<Outcome<ReturnType>> => {
  return pipe(
    () =>
      strategyEstimates(dto.strat, {
        timeDecayBasis: TIME_DECAY_BASIS.CALENDAR_DAYS,
        skipTheoPoints: true,
        ivHist: dto.ivHist || undefined,
      }),
    withErr((_e) => errorFactory("Could not get strategy estimates")),
    ifNotErr((s) =>
      s.summary.pop === null
        ? errorFactory("Could not calculate PoP")
        : {
            pop: s.summary.pop,
            pop100: s.summary.pop100,
            pop75: s.summary.pop75,
            pop50: s.summary.pop50,
          }
    )
  )();
};

export default getPopRoute;
