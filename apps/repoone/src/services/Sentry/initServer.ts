import * as Sentry from "@sentry/node";
import { SENTRY } from "../../config/Sentry";

export default function initSentry() {
  if (SENTRY.DSN) {
    // console.log('Initialising Sentry');
    Sentry.init({ dsn: SENTRY.DSN });
  }
}
