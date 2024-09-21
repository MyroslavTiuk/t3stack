import { type GetServerSidePropsContext } from "next";
import { type Session, unstable_getServerSession } from "next-auth";

import { authOptions } from "../../pages/api/auth/[...nextauth]";

/**
 * Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs
 * See example usage in trpc createContext or the restricted API route
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  // In test environment, we don't want to use the real next-auth session
  // because we are not going through the login flow.
  // Instead, we use the session provided by the header.
  if (process.env.APP_ENV === "test" && ctx.req.headers.session) {
    return JSON.parse(ctx.req.headers.session as string) as Session;
  }
  return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
};
