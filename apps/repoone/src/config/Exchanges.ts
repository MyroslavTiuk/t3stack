export default {
  /***
   * Time to cache backend third party data requests
   **/
  TTL_PRICE_DATA_THIRD_PARTY: 15, // minutes

  /***
   * Time to cache responses
   */
  TTL_PRICE_DATA: 15, // minutes

  /**
   * Time to cache possibly unsuccessful metadata about requests (i.e. postVars)
   */
  TTL_META_DATA: 60, // minutes

  /**
   * Time to cache successful metadata about requests (i.e. postVars), for fallback
   */
  TTL_LAST_GOOD_META: 60 * 24, // 1 day

  /**
   * Maximum wait time for data
   */
  DATA_TIMEOUT: 120 * 1000, // To be in ms
};
