import { type t } from "opc-types/lib";
import { Err } from "errable/dist";
import HTTP_STATUSES from "../../consts/HTTP_STATUSES";
import { isError } from "util";

export const getHTTPStatus = (error: Err<t.ErrorData>): number => {
  const errStr: string = error.message;
  return HTTP_STATUSES[errStr] || 500;
};

export function errorFactory(
  message: string,
  cfg_: Omit<t.ErrorData, "message"> = {}
): Err<t.ErrorData> {
  return new Err(message, errorDataFactory(message, cfg_));
}

export function errorDataFactory(
  message: string,
  cfg: Omit<t.ErrorData, "message"> = {}
): t.ErrorData {
  const errData: t.ErrorData = {
    message,
  };

  if (cfg.desc) errData.desc = cfg.desc;
  if (cfg.severity) errData.severity = cfg.severity;
  if (cfg.code) errData.code = cfg.code;
  if (cfg.status) errData.status = cfg.status;
  if (cfg.data) errData.data = cfg.data;
  if (cfg.token) errData.token = cfg.token;

  return errData;
}

export const catchErrors =
  (msg: string) =>
  (error: t.ErrorData): Err<t.ErrorData> => {
    if (isError(error)) return errorFactory(msg, { data: error });
    else {
      return errorFactory(msg);
    }
  };
