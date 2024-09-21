import { NextApiRequest as Request } from 'next';
import { RequestVars } from './RequestVars';

// todo: if auth middleware ends up adding data into Request (ala passport style), then this can be used:

export type AuthorizedRequestOf<ReqVars extends RequestVars> = Request &
  /* & {
    user: {
        id: string,
        email: string,
        token: string,
    },
} */ ReqVars;
