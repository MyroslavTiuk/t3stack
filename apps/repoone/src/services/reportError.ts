import * as Sentry from "@sentry/node";
import l from "./logger";
import { ERROR_SEVERITY } from "../consts";
import { fill } from "../utils/Data/dataTransform/dataTransform";
import { SENTRY } from "../config/Sentry";
import ENV from "../config/Env";

export type ReportParams = {
  category?: string;
  id: string;
  detail?: string;
  data?: Object;
  severity?: number;
  bufferCategory?: number; // in minutes
  toleranceCategory?: number; // decimal
  bufferID?: number; // in minutes
  toleranceID?: number; // decimal
};

const SeverityMap: Record<number | "default", Sentry.Severity> = {
  // @ts-ignore
  [ERROR_SEVERITY.WARNING]: Sentry.Severity.Warning,
  // @ts-ignore
  [ERROR_SEVERITY.ERROR]: Sentry.Severity.Error,
  // @ts-ignore
  default: Sentry.Severity.Error,
};

const reportError = (paramsPassed: ReportParams): void => {
  const params = fill(paramsPassed, {
    category: "general",
    id: "default",
    data: {},
    severity: ERROR_SEVERITY.WARNING,
  }) as Required<ReportParams>;
  if (SENTRY.SEND_ERRORS) {
    Sentry.configureScope(function (scope: Sentry.Scope) {
      scope.setLevel(SeverityMap[params.severity] || SeverityMap.default);
      scope.setFingerprint([params.category, params.id]);
      scope.setExtra("data", params.data);
      scope.setExtra("detail", params.detail);
    });
    Sentry.captureException(Error(params.id));
  }
  if (ENV.ENABLE_DEBUG) {
    l.error(`[${params.category}] `, params.id, params.data);
  }
};

export default reportError;
