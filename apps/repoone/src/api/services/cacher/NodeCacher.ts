// var NodeCache = require('node-cache');
import NodeCache from "node-cache";
import { ERROR_SEVERITY } from "../../../consts";
import reportServerError from "../../../services/Sentry/reportServerError";
import { type t } from "opc-types/lib";
import { catchErrors, errorFactory } from "../../infrastructure/errorHanding";
import l from "../../../services/logger";

let db: NodeCache;

// eslint-disable-next-line @typescript-eslint/ban-types
export const init: Function = () => {
  if (!db) {
    l.info("initialising nodecache db...");
    db = new NodeCache({
      checkperiod: 3600, // how long between sweeping for expired entries (seconds?)
      useClones: false, // reference to the actual stored data (don't mutate! ...or do...)
    });
    l.info(" ∟ completed initalisation of nodecache db");
  }
};

init();

const NodeCacher: t.CacherBridge = {
  save(key: string, expiry: number, data: any): Promise<t.Outcome<true>> {
    return new Promise<t.Outcome<true>>((resolve, _) => {
      const success = db.set(key, data, expiry - Date.now() / 1000);
      if (success) {
        resolve(<const>true);
      } else {
        reportServerError({
          id: "Error saving to cache (in callback)",
          data: {
            err: "unknown",
            key,
            data,
          },
          severity: ERROR_SEVERITY.ERROR,
        });
        resolve(errorFactory("Error saving to cache (in callback)"));
      }
    }).catch(catchErrors("Error saving to cache (caught)"));
  },

  /**
   * value of undefined indicates no value was saved
   * value of non-undefined is the cached value
   * error is error
   */
  read<R>(key: string): Promise<t.Outcome<R | undefined>> {
    return new Promise<t.Outcome<R | undefined>>((resolve, _) => {
      resolve(db.get(key));
    }).catch(catchErrors("Error reading from cache (caught)"));
  },
};

/**
 * Cache or get.
 *
 * @param key
 * @param fn
 * @param args
 * @returns
 */
export const cacheOrGet = async (
  key: string,

  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function,
  args: any[]
): Promise<unknown> => {
  const cachedValue = db.get(key);

  try {
    if (cachedValue !== undefined) {
      const isExpired = db.ttl(key);
      if (isExpired) {
        const result = await fn(...args);
        await db.set(key, result, 15);
        return result;
      } else {
        return cachedValue;
      }
    } else {
      const result = await fn(...args);
      await db.set(key, result, 15);
      return result;
    }
  } catch (e) {
    catchErrors("Error reading from cache (caught)");
  }
};

export default NodeCacher;
