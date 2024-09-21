import ifUndef from "../utils/Data/ifUndef/ifUndef";

const IS_PROD = process?.env?.NODE_ENV === "production";
const IS_DEV = process?.env?.NODE_ENV === "development";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const IS_TEST = true; //[process?.env?.NODE_ENV, undefined].indexOf('testing') >= 0;

export default {
  // vars with defaults
  TEST_OFFLINE: Boolean(
    ifUndef<string | boolean>(process?.env?.TEST_OFFLINE, false)
  ),

  GLOBAL_CACHE: Boolean(
    ifUndef<string | boolean>(process?.env?.GLOBAL_CACHE, true)
  ),
  USE_CACHE_FUNCS: Boolean(
    ifUndef<string | boolean>(process?.env?.USE_CACHE_FUNCS, true)
  ),
  USE_CACHE_REQ: Boolean(
    ifUndef<string | boolean>(process?.env?.USE_CACHE_REQ, false)
  ),
  ENABLE_DEBUG: !IS_PROD,
  DEBUG_REDIRECTS: Boolean(
    ifUndef<string | boolean>(process?.env?.DEBUG_REDIRECTS, !IS_PROD)
  ),

  NODE_ENV: ifUndef(process?.env?.NODE_ENV, "testing"),

  IS_PROD,
  IS_DEV,
  IS_TEST,
};
