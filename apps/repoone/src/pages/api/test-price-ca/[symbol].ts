// @ts-nocheck

import { type ReqParams, type ReturnType } from "~/api/routes/price/types";
import { type RequestOf } from "opc-types/lib/api/RequestOf";
import { type NextApiResponse as Response } from "next/dist/next-server/lib/utils";
import { type t } from "opc-types/lib";
import { responderWithCatch } from "~/api/infrastructure/responder";

import getPrice from "../../../api/services/priceData/exchanges/ca";

const priceRoute = (
  req: RequestOf<ReqParams>,
  res: Response
): Promise<t.Outcome<ReturnType>> => {
  return getPrice(req?.params?.symbol || req?.query?.symbol || "").then(
    ...responderWithCatch(res)
  );
};

export default priceRoute;
