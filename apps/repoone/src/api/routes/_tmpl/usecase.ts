import { type ReturnType, type DTOValidated } from "./types";
import { type Outcome } from "opc-types/lib/Outcome";

const getFinderRoute = async (
  _: DTOValidated
): Promise<Outcome<ReturnType>> => {
  return {};
};

export default getFinderRoute;
