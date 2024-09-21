import { withSentryConfig } from "@sentry/nextjs";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

// Load the risk free interest rate from the Treasury API (https://fiscaldata.treasury.gov/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities)
// at build time and pass it to the client as an environment variable.

async function getRiskFreeRate() {
  // const response = await fetch(
  //   "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates?filter=security_desc:eq:Treasury%20Bills&sort=-record_date&fields=record_date,avg_interest_rate_amt"
  // );
  // const data = await response.json();
  // return data.data[0].avg_interest_rate_amt / 100;

  // TODO: This API call currently fails builds with with an SSL error: UNABLE_TO_VERIFY_LEAF_SIGNATURE, we should figure out how to fix it.
  // For now, we'll just hardcode the value.
  return 0.05319 
}

const riskFreeRate = await getRiskFreeRate();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    riskFreeRate,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};

const sentryConfig = {
  // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
  // for client-side builds. (This will be the default starting in
  // `@sentry/nextjs` version 8.0.0.) See
  // https://webpack.js.org/configuration/devtool/ and
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
  // for more information.
  hideSourceMaps: true,
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const moduleExports = {
  ...nextConfig,
  sentry: sentryConfig,
};

export default withSentryConfig(moduleExports, sentryWebpackPluginOptions);
