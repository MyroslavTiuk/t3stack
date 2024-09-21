import { type NextFunction, type Request, type Response } from "express";

// if the req.path matches the supplied regex, evalute the route, otherwise skip it
export default function (regex: RegExp) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!regex.test(req.path)) {
      next("route");
      return;
    }
    next();
  };
}
