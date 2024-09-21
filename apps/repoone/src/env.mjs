import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  OPCALC_DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string().min(1) : z.string().url()
  ),
  // Add `.min(1) on ID and SECRET if you want to make sure they're not empty
  GOOGLE_ID: z.string(),
  GOOGLE_SECRET: z.string(),
  CSV_IMPORT_S3_BUCKET: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  // NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_PRICE_ID: z.string(),
  STRIPE_WEBHOOK_SIGNING: z.string(),
  EMAIL_SERVER: z.string(),
  EMAIL_FROM: z.string(),
  TRADIER_TOKEN: z.string(),
  V2_API_BASE_URL_CALCULATOR: z.string(),
  DEFAULT_INPUT_METHOD: z.string(),
  TEST_OFFLINE: z.string().optional(),
  GLOBAL_CACHE: z.string(),
  USE_CACHE_FUNCS: z.string().optional(),
  USE_CACHE_REQ: z.string(),
  DEBUG_REDIRECTS: z.string().optional(),
  BACKTESTER_SOURCE_API_ROUTE: z.string(),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  NEXT_PUBLIC_TD_AMERITRADE_API_KEY: z.string(),
  // NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string()
});
export const clientSchema = z.object({
  NEXT_PUBLIC_HIDE_SCANNER: z.string().optional(),
});
export const clientEnv = {
  NEXT_PUBLIC_HIDE_SCANNER: process.env.NEXT_PUBLIC_HIDE_SCANNER,
};

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side, so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  OPCALC_DATABASE_URL: process.env.OPCALC_DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  GOOGLE_ID: process.env.GOOGLE_ID,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
  NEXT_PUBLIC_TD_AMERITRADE_API_KEY:
    process.env.NEXT_PUBLIC_TD_AMERITRADE_API_KEY,
  CSV_IMPORT_S3_BUCKET: process.env.CSV_IMPORT_S3_BUCKET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  // NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
  STRIPE_WEBHOOK_SIGNING: process.env.STRIPE_WEBHOOK_SIGNING,
  EMAIL_SERVER: process.env.EMAIL_SERVER,
  EMAIL_FROM: process.env.EMAIL_FROM,
  TRADIER_TOKEN: process.env.TRADIER_TOKEN,
  V2_API_BASE_URL_CALCULATOR: process.env.V2_API_BASE_URL_CALCULATOR,
  DEFAULT_INPUT_METHOD: process.env.DEFAULT_INPUT_METHOD,
  TEST_OFFLINE: process.env.TEST_OFFLINE,
  GLOBAL_CACHE: process.env.GLOBAL_CACHE,
  USE_CACHE_FUNCS: process.env.USE_CACHE_FUNCS,
  USE_CACHE_REQ: process.env.USE_CACHE_REQ,
  DEBUG_REDIRECTS: process.env.DEBUG_REDIRECTS,
  BACKTESTER_SOURCE_API_ROUTE: process.env.BACKTESTER_SOURCE_API_ROUTE,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  );

  if (parsed.success === false) {
    // eslint-disable-next-line no-console
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  // eslint-disable-next-line no-undef
  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
        throw new Error(
          process.env.NODE_ENV === "production"
            ? "❌ Attempted to access a server-side environment variable on the client"
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        );
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
