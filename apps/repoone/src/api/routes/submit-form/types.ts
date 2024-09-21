import { type Nullable } from "opc-types/lib/util/Nullable";
import { type SubmitFormParams } from "opc-types/lib/api/requests/SubmitFormParams";

export type ReqParams = SubmitFormParams;

export type DTO = {
  formType: string;
  name: Nullable<string>;
  email: Nullable<string>;
  message: string;
};

export type ReturnType = NonNullable<unknown>;
