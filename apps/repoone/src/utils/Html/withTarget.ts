import { useCallback } from "react";

type E = {
  target: {
    value: string;
  };
};

export default function withTarget<R>(handler: (val: string) => R) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useCallback((e: E) => handler(e.target.value), [handler]);
}
