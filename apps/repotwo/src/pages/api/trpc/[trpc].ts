import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/router/_app";
import { createContext } from "src/server/context";
import { env } from "src/env/server.mjs";

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          // eslint-disable-next-line no-console
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined,
});
