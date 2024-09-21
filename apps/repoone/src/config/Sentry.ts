import ifUndef from '../utils/Data/ifUndef/ifUndef';

export const SENTRY = {
  DSN: ifUndef(process?.env?.sentry_dsn, ''),
  SEND_ERRORS: Boolean(
    ifUndef<boolean | string>(process?.env?.sentry_send_errors, false),
  ),
};
