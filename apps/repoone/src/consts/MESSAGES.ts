import { createConsts } from '../utils/createConsts/createConsts';

export default createConsts('MESSAGES', [
  // *** Cache ***
  'CACHE_NOT_ENABLED',
  'CACHE_KEY_EMPTY',
  // *** Data source ***
  'EXCHANGE_NOT_FOUND',
  'SYMBOL_NOT_FOUND',
  'CBOE_COULD_NOT_ACCESS_QUOTE_ENDPOINT',
  'CBOE_COULD_NOT_RESOLVE_DOWNLOAD',
  'UNEXPECTED_FORMAT',
  'OPTIONS_NOT_FOUND',
  'INCORRECT_ROOT_SYMBOL',
  // *** Calculation ***
  'CALCULATION_ERROR',
  'CALCULATION_INVALID_STRATEGY',
  // *** AUTHENTICATION ***
  'AUTHENTICATION_NOT_FOUND',
  'AUTHENTICATION_FAILED'
]);
