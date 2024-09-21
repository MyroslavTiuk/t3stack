import { env } from "~/env.mjs";

export const featureFlags = {
  enableCalendar: env.NEXT_PUBLIC_ENABLE_DEV_FEATURES === "true",
  enableAnalytics: env.NEXT_PUBLIC_ENABLE_DEV_FEATURES === "true",
};
