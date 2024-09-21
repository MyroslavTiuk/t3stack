type Action<S> = {
  type: string;
  payload?: {
    txfn: (state: S) => S;
  };
};

/**
 * HOF for existing reducers (optional)
 *
 * Listens for TXFN action, checks whether the TXFN action is applicable by evaluating equality on the stored
 * txfmReducer internally, and executes the function wrapped in the txfnAction
 */
export function makeTxfnReducer<S>(
  scope = "",
  fallbackReducer = (s: S, _a: any) => s
) {
  return (state: S, action: Action<S>) => {
    if (
      action.type === `${scope}/TXFN` &&
      typeof action.payload?.txfn === "function"
    ) {
      // @ts-ignore
      return action.payload.txfn(state);
    } else {
      return fallbackReducer(state, action);
    }
  };
}

/**
 * Pass this a reducer to make an action creator specific to the reducer supplied
 */
export function makeTxfnActionCreator<S>(scope = "") {
  return (txfn: (state: S) => S) => ({
    type: `${scope}/TXFN`,
    payload: {
      txfn,
    },
  });
}

/**
 * Helper for redux-actions; May not actually work
 */
export function txfnReduxActionsReducer<S>(scope = "") {
  return {
    [`${scope}/TXFN`]: makeTxfnReducer<S>(scope),
  };
}
