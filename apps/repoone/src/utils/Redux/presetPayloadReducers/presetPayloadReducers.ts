export default {
  makeSetter:
    <T>() =>
    (_state: T, payload: T): T =>
      payload,
  makeMerge:
    <T extends {}>() =>
    (state: T, payload: Partial<T>): T => ({
      ...state,
      ...payload,
    }),
  push: <T>(state: T[], payload: T): T[] => state.concat([payload]),
  makeUpsertOnProp:
    <T extends { [key: string]: any }>(propName: string) =>
    (state: T[], payload: T): T[] => {
      const existingItem = state.find(
        (item) => item[propName] === payload[propName]
      );
      if (existingItem === undefined) return state.concat(payload);
      return state.map((item) =>
        item[propName] === payload[propName] ? payload : item
      );
    },
  makePropSetter:
    <T extends { [key: string]: any }, K extends keyof T>(
      propName: K,
      fixedValue?: T[K]
    ) =>
    (state: T, payload: T[K]): T => {
      return {
        ...state,
        [propName]: fixedValue !== undefined ? fixedValue : payload,
      };
    },
  makeReset:
    <T>(initState: T) =>
    (): T =>
      initState,
  empty: (): null => null,
};
