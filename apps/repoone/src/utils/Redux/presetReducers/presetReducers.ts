import { type Action } from "opc-types/lib/store/Action";

export default {
  makeSetter:
    <T>() =>
    (_state: T, action: Action<T>): T =>
      action.payload,
  makeMerge:
    <T extends {}>() =>
    (state: T, action: Action<Partial<T>>): T => ({
      ...state,
      ...action.payload,
    }),
  makeReset:
    <T>(initState: T) =>
    (): T =>
      initState,
  empty: (): null => null,
};
