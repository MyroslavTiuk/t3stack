import { type NextApiRequest, type NextApiResponse } from "next";
import { type NextFunction } from "express";
import submitFormRoute from "../../../api/routes/submit-form";
import withErrorGuard from "../../../api/infrastructure/withErrorGuard";
import { withDefaultCors } from "../../../api/infrastructure/withCors";

export default function route(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextFunction
) {
  return withErrorGuard(withDefaultCors(submitFormRoute.controller))(
    req as unknown as any,
    res,
    next
  );
}
