import { type NextApiRequest, type NextApiResponse } from "next";
import { type NextFunction } from "express";
import getPrice from "../../../api/routes/price";
import withErrorGuard from "../../../api/infrastructure/withErrorGuard";
import { withDefaultCors } from "../../../api/infrastructure/withCors";

export default function route(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextFunction
) {
  return withErrorGuard(withDefaultCors(getPrice.controller))(
    req as unknown as any,
    res,
    next
  );
}
