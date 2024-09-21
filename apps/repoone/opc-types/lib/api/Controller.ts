import { NextFunction } from 'express';
import { NextApiResponse as Response } from 'next';
import { RequestOf } from './RequestOf';
import { RequestVars } from './RequestVars';
import { t } from '../index';

export type Controller<ReqVars extends RequestVars, SuccessResponse> = (
  req: RequestOf<ReqVars>,
  res: Response,
  next: NextFunction,
) => t.Outcome<SuccessResponse> | Promise<t.Outcome<SuccessResponse>>;
