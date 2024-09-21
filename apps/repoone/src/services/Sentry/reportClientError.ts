import * as Sentry from "@sentry/browser";

import { type ReportParams } from "./types/ReportParams";
import reportError from "./reportError";
import getHotjarUserId from "../../pwa/components/layouts/MainLayout/utils/getHotjarUserId";

const reportClientError = (paramsPassed: ReportParams) => {
  getHotjarUserId();
  const moreParams = {
    ...paramsPassed,
    data: {
      hotjarId: getHotjarUserId(),
      ...(paramsPassed.data || {}),
    },
  };
  reportError(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (doesn't like a generalisation I made to allow for browser and node versions)
    Sentry,
    moreParams
  );
};

export default reportClientError;
