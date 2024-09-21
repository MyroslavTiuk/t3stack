// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn:
    SENTRY_DSN ||
    "https://b0c2031e831f49549ff72de056fd4c5f@o4503961516507136.ingest.sentry.io/4503969736032256",
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.2,
});
