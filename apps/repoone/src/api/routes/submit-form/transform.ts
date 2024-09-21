import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type ReqParams, type DTO } from "./types";
import { type Outcome } from "opc-types/lib/Outcome";
import { errorFactory } from "../../infrastructure/errorHanding";

export default function transform(req: RequestOf<ReqParams>): Outcome<DTO> {
  if (!req.body.message) {
    return errorFactory("No message");
  }

  const { formType, name, email, message, ...fields } =
    typeof req.body === "object"
      ? req.body
      : {
          formType: "unknown",
          name: null,
          email: null,
          message: "",
        };

  return {
    formType: formType || "general",
    name: name || null,
    email: email || null,
    message: message || "",
    ...fields,
  };
}
