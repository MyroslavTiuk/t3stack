import { type NextApiRequest, type NextApiResponse } from "next";
import { type NextFunction } from "express";
import popV2route from "../../../api/routes/pop/index.v2";
import withErrorGuard from "../../../api/infrastructure/withErrorGuard";
import { withDefaultCors } from "../../../api/infrastructure/withCors";

export default function route(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextFunction
) {
  return withErrorGuard(withDefaultCors(popV2route.controller))(
    req as unknown as any,
    res,
    next
  );
}
