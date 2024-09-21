import { clientEnv } from "src/env/schema.mjs";

export const featureFlags = {
  hideScanner: clientEnv.NEXT_PUBLIC_HIDE_SCANNER === "true",
};
