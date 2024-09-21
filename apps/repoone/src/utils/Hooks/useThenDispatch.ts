// @ts-nocheck

import { useDispatch } from "react-redux";
import { useCallback } from "react";

import { type IAction } from "redux-promise-middleware-actions/lib/actions";

type Config<A extends any[], T> = {
  onSuccessAction?: (data: T, args: A) => IAction<T, undefined>;
  onFailureAction?: (data: T, args: A) => IAction<T, undefined>;
  preAction?: (...args: A) => IAction<undefined, undefined>;
};

function useThenDispatch<T, A extends any[]>(
  config: Config<A, T>,
  getter: (...args: A) => Promise<T>
) {
  const dispatch = useDispatch();
  return useCallback(
    async (...args: A) => {
      config.preAction && dispatch(config.preAction(...args));
      return getter(...args)
        .then((data: T) =>
          config.onSuccessAction
            ? dispatch(config.onSuccessAction(data, args))
            : undefined
        )
        .catch((error) =>
          config.onFailureAction
            ? dispatch(config.onFailureAction(error, args))
            : undefined
        );
    },
    [dispatch]
  );
}

export default useThenDispatch;
