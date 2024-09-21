import { useCallback } from 'react';

function usePartialledCallback<A extends any[], R>(
  callbackFunction: (...args: A) => R,
  args: A,
) {
  return useCallback(() => callbackFunction(...args), args);
}

export default usePartialledCallback;
