import { type Err, ifErr, ifNotErr, ifNotErrAsync, isErr } from "errable";
import moment from "moment-timezone";

import { type Outcome } from "opc-types/lib/Outcome";
import { type ErrorData } from "opc-types/lib/api/ErrorData";

import { get } from "../../../../http";

import { errorFactory } from "~/api/infrastructure/errorHanding";
import delay from "../../../../../../utils/delay/delay";
import Exchanges from "../../../../../../config/Exchanges";

enum ERRORS {
  UNKNOWN = "UNKNOWN",
  NO_CACHE = "NO_CACHE",
  CACHE_STALE = "CACHE_STALE",
  COULD_NOT_UPDATE = "COULD_NOT_UPDATE",
  UNEXPECTED_FORMAT = "UNEXPECTED_FORMAT",
  OPTIONS_NOT_FOUND = "OPTIONS_NOT_FOUND",
  SYMBOL_NOT_FOUND = "SYMBOL_NOT_FOUND",
}

const CACHE_WAIT = 3000;
const CACHE_SUBSEQ_WAIT = 1000;

function makeRefreshCacheFetchCall(stock: string) {
  return new Promise((res, _) => {
    get(`https://www.cboe.com/delayed_quote/api/options/${stock}`, {
      headers: {
        Referer: "https://www.cboe.com/delayed_quotes/vix",
      },
      randomizeProxy: true,
      acceptNon200: true,
    })
      .then(
        ifNotErrAsync(async (resp) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (typeof resp === "object" && resp?.error === "symbol not found") {
            return errorFactory(ERRORS.SYMBOL_NOT_FOUND);
          } else if (
            typeof resp === "object" &&
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            resp?.error === "no options found for the symbol"
          ) {
            return errorFactory(ERRORS.OPTIONS_NOT_FOUND);
          } else if (
            typeof resp !== "object" ||
            (typeof resp === "object" &&
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              resp?.status !== "Processing remote caching request")
          ) {
            return errorFactory(ERRORS.UNKNOWN);
          }
          return delay(Math.max(1, CACHE_WAIT - CACHE_SUBSEQ_WAIT), true);
        })
      )
      .then(
        ifNotErrAsync(async (_resp) => {
          let c = 1;
          let result;
          do {
            const tR = await Promise.all([
              delay(CACHE_SUBSEQ_WAIT),
              makeFetchCall(stock),
            ]);
            result = tR[1];
            c++;
          } while (c < 10 && isErr(result));
          if (isErr(result)) {
            if (result.message === ERRORS.NO_CACHE) {
              return errorFactory(ERRORS.COULD_NOT_UPDATE);
            } else if (result.message === ERRORS.CACHE_STALE) {
              return (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                result.data?.data ||
                errorFactory(ERRORS.UNKNOWN, {
                  data: "Cache was stale but no data in error",
                })
              );
            }
          }
          return result;
        })
      )
      .then(res)

      .catch((_) => res(errorFactory(ERRORS.UNKNOWN)));
  });
}

const publicHolidays = [
  "2021-01-18",
  "2021-02-15",
  "2021-04-02",
  "2021-05-31",
  "2021-06-05",
  "2021-09-06",
  "2021-12-24",
  // todo: 2022 holidays
];

function makeFetchCall(stock: string, acceptStale = false) {
  return get(
    `https://cdn.cboe.com/api/global/delayed_quotes/options/${stock}.json`,
    {
      headers: {
        Referer: "https://www.cboe.com/delayed_quotes/vix",
      },
      randomizeProxy: true,
      acceptNon200: true,
    }
  ).then(
    ifNotErr((resp) => {
      if (typeof resp === "string" && resp.indexOf("AccessDenied") !== -1) {
        return errorFactory(ERRORS.NO_CACHE);
      }
      if (!acceptStale && typeof resp === "object") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const timeUpdated = (resp?.timestamp as string) || null;
        if (timeUpdated === null) {
          return errorFactory(ERRORS.UNEXPECTED_FORMAT, { data: resp });
        }
        const timeUpdatedTs = new Date(`${timeUpdated}+00:00`).getTime();
        const momentNow = moment().tz("America/New_York");
        const dayOfWeek = momentNow.day();
        const marketIsClosed =
          [0, 6].includes(dayOfWeek) ||
          (dayOfWeek === 5 && momentNow.hour() >= 18) ||
          momentNow.hour() <= 5 ||
          publicHolidays.includes(momentNow.format("YYYYMMDD")) ||
          false;

        if (
          !marketIsClosed &&
          timeUpdatedTs <
            Date.now() - Exchanges.TTL_PRICE_DATA_THIRD_PARTY * 60 * 1000
        ) {
          return errorFactory(ERRORS.CACHE_STALE, { data: resp });
        }
      }
      try {
        return typeof resp === "object"
          ? resp
          : typeof resp === "string"
          ? JSON.parse(resp)
          : errorFactory(ERRORS.UNEXPECTED_FORMAT, { data: resp });
      } catch (e) {
        return errorFactory("COULD_NOT_PARSE", { data: e });
      }
    })
  );
}

const fetchPriceData = (stock: string): Promise<Outcome<unknown>> => {
  return Promise.resolve(stock)
    .then((s) => makeFetchCall(s, true))
    .then(
      ifErr((err: Err<ErrorData>) => {
        if (
          ([ERRORS.CACHE_STALE, ERRORS.NO_CACHE] as string[]).includes(
            err.message
          )
        ) {
          return makeRefreshCacheFetchCall(stock);
        }
        return err;
      })
    );
};

export default fetchPriceData;
