import type { NextApiRequest as Request } from "next";
import type { RequestVars, RequestVarsRequired } from "./RequestVars";

export type RequestOf<ReqVars extends RequestVars> = Omit<
  Request,
  "query" | "path" | "body"
> & { path: string } & RequestVarsRequired &
  ReqVars;
