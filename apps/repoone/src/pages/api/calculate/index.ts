import { type NextApiRequest, type NextApiResponse } from "next";
import { type NextFunction } from "express";
import calculateRoute from "../../../api/routes/calculate";
import withErrorGuard from "../../../api/infrastructure/withErrorGuard";
import { withDefaultCors } from "../../../api/infrastructure/withCors";

export default function route(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextFunction
) {
  return withErrorGuard(withDefaultCors(calculateRoute.controller))(
    req as unknown as any,
    res,
    next
  );
}
