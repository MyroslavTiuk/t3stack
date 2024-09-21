import { pipe } from "ramda";
import { withErr, withNotErr } from "errable";

import { type Outcome } from "opc-types/lib/Outcome";
import { strategyEstimates } from "../../../services/calculate/strategyEstimates";
import { errorDataFactory } from "../../infrastructure/errorHanding";

import { type DTOValidated, type ReturnType } from "./types";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import MESSAGES from "../../../consts/MESSAGES";
import { TIME_DECAY_BASIS } from "../../../types/enums/TIME_DECAY_BASIS";

const calculatePostRoute = (dto: DTOValidated): Outcome<ReturnType> => {
  return pipe(
    () =>
      strategyEstimates(dto.calculation, {
        /* todo */ timeDecayBasis: TIME_DECAY_BASIS.CALENDAR_DAYS,
      }),
    withErr((err: string[]) =>
      errorDataFactory(MESSAGES.CALCULATION_ERROR, { data: err })
    ),
    withNotErr((estimate: StrategyEstimate) => ({ estimate }))
  )();
};

export default calculatePostRoute;
