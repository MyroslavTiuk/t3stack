import { type NextApiRequest } from "next";

type IReq = { headers: NextApiRequest["headers"] };

export default function extractAuthToken(req: IReq): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_bearer, token] = req.headers?.authorization?.split?.(" ") || [
    null,
    undefined,
  ];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return token;
}
