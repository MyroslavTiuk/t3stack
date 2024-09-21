import { useCallback } from 'react';

const useDependentCallback = <A extends any[], B extends any[], T>(
  callback: (inputs: B, args: A) => T,
  inputs: B,
) => {
  return useCallback((...args: A) => callback(inputs, args), inputs);
};

export default useDependentCallback;
