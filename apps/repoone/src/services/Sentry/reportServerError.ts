import * as Sentry from "@sentry/node";

import { type ReportParams } from "./types/ReportParams";
import reportError from "./reportError";

const reportServerError = (paramsPassed: ReportParams) => {
  reportError(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (doesn't like a generalisation I made to allow for browser and node versions)
    Sentry,
    paramsPassed
  );
};

export default reportServerError;
