import { type Outcome } from "opc-types/lib/Outcome";
import { pipe } from "ramda";
import { withErr, withNotErr } from "errable";

import { type StrategyComplete } from "opc-types/lib/Strategy";
import MESSAGES from "../../../consts/MESSAGES";
import { errorDataFactory } from "../../infrastructure/errorHanding";
import validateStrategy from "../../../utils/Finance/validateStrategy";

import { type DTO, type DTOValidated } from "./types";

export default function validate({
  calculation,
  token,
}: DTO): Outcome<DTOValidated> {
  return pipe(
    () => validateStrategy(calculation),
    withErr((errs: string[]) =>
      errorDataFactory(MESSAGES.CALCULATION_INVALID_STRATEGY, { data: errs })
    ),
    withNotErr((_pass: true) => {
      const validCalc = calculation as StrategyComplete;
      return { calculation: validCalc, token };
    })
  )();
}
