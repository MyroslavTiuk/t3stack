import { Action } from './Action';
import { AppErr } from '../AppErr';

export interface AsyncActionSet<RequestParams, Response> {
  fetch: (a: RequestParams) => Action<void>;
  success: (a: Response) => Action<Response>;
  fail: (a: AppErr[]) => Action<AppErr[]>;
}
