import { clientEnv } from "~/env.mjs";

export const featureFlags = {
  hideScanner: clientEnv.NEXT_PUBLIC_HIDE_SCANNER === "true",
};
