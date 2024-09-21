import { type Outcome } from "opc-types/lib/Outcome";

import { type DTO, type DTOValidated } from "./types";

export default function validate(dto: DTO): Outcome<DTOValidated> {
  return dto;
}
