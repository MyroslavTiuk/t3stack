// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArgsFn<A extends any[], T> = ((...args: A) => T) | (() => void);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createAction = <A extends any[], T, F extends ArgsFn<A, T>>(
  snakeKey: string,
  action: F,
): ((...args: A) => { type: string; payload: T | void }) => {
  const creatorFn = (...args: A) => ({
    type: snakeKey,
    payload: action(...args),
  });
  creatorFn.toString = () => snakeKey;
  return creatorFn;
};

export const makeCreateAction = (ns: string) => <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  A extends any[],
  T,
  F extends ArgsFn<A, T>
>(
  snakeKey: string,
  action: F,
): ((...args: Parameters<F>) => { type: string; payload: void | T }) =>
  createAction(`${ns}/${snakeKey}`, action);
