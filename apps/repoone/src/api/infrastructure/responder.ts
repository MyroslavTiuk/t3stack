import * as Mx from "errable";
import { omit } from "ramda";

import { type NextApiResponse as Response } from "next";
import { type t } from "opc-types/lib";
import { getHTTPStatus } from "./errorHanding";

// todo: Build status into ErrorData
const responder =
  (res: Response, message?: string) =>
  <T>(result: t.Outcome<T>): t.Outcome<T> => {
    res.setHeader("Content-type", "application/json");
    if (result instanceof Error || Mx.isErr(result)) {
      const errMessage = result.message;
      let dataMessage, data;
      if (Mx.isErr(result)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore (checking safely)
        dataMessage = result?.data?.message;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore (checking safely)
        data = omit(["message"], result?.data?.data || result?.data || {});
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const useStatus = getHTTPStatus(result);

      res.status(useStatus).send({
        message: errMessage || dataMessage,
        success: false,
        data: data || {},
      });
    } else {
      const { token, ...data } = result as T & { token?: string };
      res.status(200).send({
        data,
        success: true,
        message: message || "Success",
        ...(token ? { token } : {}),
      });
    }
    return result;
  };

export default responder;

export const responderWithCatch = (res: Response, message?: string) => {
  return [responder(res, message), responder(res, message)];
};
