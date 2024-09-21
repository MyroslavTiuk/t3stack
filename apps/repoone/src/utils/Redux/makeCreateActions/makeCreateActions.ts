import { camelToSnake } from '../../String';

const makeCreateActions = (ns: string) => <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  O extends { [P in keyof O]: ((...args: any[]) => any) | (() => void) }
>(
  actionMap: O,
): {
  [P in keyof O]: (
    ...args: Parameters<O[P]>
  ) => { type: string; payload: ReturnType<O[P]> };
} =>
  Object.keys(actionMap).reduce((acc: Partial<O>, k: string) => {
    // @ts-ignore
    if (actionMap[k].pending !== undefined) {
      // @ts-ignore
      return { ...acc, [k]: actionMap[k] };
    }
    const actionSnake = camelToSnake(k);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const creatorFn = (...args: any[]) => ({
      type: `${ns}/${actionSnake}`,
      // @ts-ignore
      ...(actionMap[k] ? { payload: actionMap[k](...args) } : {}),
    });
    creatorFn.toString = () => `${ns}/${actionSnake}`;
    return {
      ...acc,
      [k]: creatorFn,
    };
  }, {}) as {
    [P in keyof O]: (
      ...args: Parameters<O[P]>
    ) => { type: string; payload: ReturnType<O[P]> };
  };

export default makeCreateActions;
