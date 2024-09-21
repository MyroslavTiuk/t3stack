import { useCallback } from 'react';

const usePartialCB = (
  fn: Function,
  firstParam: string | string[],
  prep: (val: any) => any = (x) => x,
) => useCallback((val: string | boolean) => fn(firstParam, prep(val)), [fn]);

export default usePartialCB;
