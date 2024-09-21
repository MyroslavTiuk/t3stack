import { NextApiRequest as RequestHandler } from 'next';
import { Controller } from './Controller';
import { RequestVars } from './RequestVars';

export type RouteDef<Q extends RequestVars, R> = {
  method?: 'get' | 'post' | 'put' | 'delete';
  controller: Controller<Q, R>;
  middleware?: RequestHandler[];
  weight?: number;
};
