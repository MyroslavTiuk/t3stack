// @ts-nocheck

import l from "../logger";
import { ERROR_SEVERITY } from "../../consts";
import { fill } from "../../utils/Data/dataTransform/dataTransform";
import { SENTRY } from "../../config/Sentry";
import ENV from "../../config/Env";
import { type ReportParams } from "./types/ReportParams";

const SeverityMap: Record<number | "default", string> = {
  [ERROR_SEVERITY.WARNING]: "warning" as const,
  [ERROR_SEVERITY.ERROR]: "error" as const,
  default: "error",
};

interface SentryScope {
  setLevel: (l: string) => void;
  setFingerprint: (f: string[]) => void;
  setExtra: (k: string, v: any) => void;
}

interface SentryInterface {
  configureScope: (scopeHandler: (scope: SentryScope) => void) => void;
  captureException: (v: any) => string;
}

const reportError = (
  sentry: SentryInterface,
  paramsPassed: ReportParams
): void => {
  const params = fill(paramsPassed, {
    category: "general",
    id: "default",
    data: {},
    severity: ERROR_SEVERITY.WARNING,
  }) as Required<ReportParams>;
  if (SENTRY.SEND_ERRORS) {
    sentry.configureScope(function (scope: SentryScope) {
      scope.setLevel(SeverityMap[params.severity] || SeverityMap.default);
      scope.setFingerprint([params.category, params.id]);
      scope.setExtra("data", params.data);
      scope.setExtra("detail", params.detail);
    });
    sentry.captureException(Error(params.id));
  }
  if (ENV.ENABLE_DEBUG) {
    l.error(`[${params.category}] `, params.id, params.data);
  }
};

export default reportError;
