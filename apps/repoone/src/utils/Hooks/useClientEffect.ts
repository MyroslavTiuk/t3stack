import { useEffect } from 'react';

export default function useClientEffect<T extends any[]>(
  fn: () => void | (() => void),
  extraDeps: T = ([] as unknown) as T,
) {
  // @ts-ignore
  const hasDoc: boolean = typeof document !== 'undefined';
  useEffect(() => {
    if (hasDoc) {
      return fn();
    }
  }, [hasDoc, ...extraDeps]);
}
