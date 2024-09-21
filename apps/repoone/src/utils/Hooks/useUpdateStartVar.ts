import useDependentCallback from "./useDependentCallback";

export default function useUpdateStateVar<S>(
  dispatchTxfn: (fn: (s: S) => S) => void
): (key: string, val: S[keyof S]) => void {
  return useDependentCallback(
    (
      [_dispatchLocal]: [typeof dispatchTxfn],
      [key, val]: [string, S[keyof S]]
    ) => {
      _dispatchLocal((s) => ({ ...s, [key]: val }));
    },
    [dispatchTxfn]
  );
}
