import { router } from "../trpc";
import { backtesterRouter } from "./backtester";
import { saveTradesRouter } from "./saveTrades";
import { scannerRouter } from "./scanner";
import { stripeRouter } from "./stripe";
import { tdApiRouter } from "./tdApi";
import { waitlistRouter } from "./waitlist";

export const appRouter = router({
  tdApi: tdApiRouter,
  waitlist: waitlistRouter,
  stripe: stripeRouter,
  scanner: scannerRouter,
  backtester: backtesterRouter,
  saveTrades: saveTradesRouter,
});

export type AppRouter = typeof appRouter;
