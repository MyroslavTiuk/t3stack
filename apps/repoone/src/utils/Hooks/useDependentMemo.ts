import { useMemo } from 'react';

const useDependentMemo = <A extends any[], T>(
  fn: (...args: A) => T,
  inputs: A,
) => {
  return useMemo(() => fn(...inputs), inputs);
};

export default useDependentMemo;
