import { createTRPCRouter } from "~/server/api/trpc";
import { transactionRouter } from "./routers/transactions";
import { tdAmeritradeRouter } from "./routers/tdAmeritrade";
import { csvRouter } from "./routers/csv";
import { stripeRouter } from "./routers/stripe";
import { strategyRouter } from "./routers/strategies";
import { analyticsRouter } from "./routers/analytics";
import { backtesterRoute } from "./routers/backtester";
import { calculations } from "./routers/calcs";
import { apiKeys } from "./routers/apiKeys";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  transactions: transactionRouter,
  strategies: strategyRouter,
  tdAmeritrade: tdAmeritradeRouter,
  csv: csvRouter,
  stripe: stripeRouter,
  analytics: analyticsRouter,
  backtester: backtesterRoute,
  calculations: calculations,
  apiKeys: apiKeys,
});

// export type definition of API
export type AppRouter = typeof appRouter;
