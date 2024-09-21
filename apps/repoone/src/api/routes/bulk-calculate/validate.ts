import { type Outcome } from "opc-types/lib/Outcome";
import { type DTO, type DTOValidated } from "./types";
import validateAuth from "../../services/auth/validateAuth";

export default function validateBulkCalc(dto: DTO): Outcome<DTOValidated> {
  return validateAuth(dto);
}
