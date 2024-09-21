import { useCallback } from "react";
import { type Action } from "opc-types/lib/store/Action";
import { useDispatch } from "react-redux";
import { type Optional } from "opc-types/lib/util/Optional";

function useDispaction<A extends any[], P>(
  actionCreator: (...args: A) => Optional<Action<P>>,
  dispatch?: (action: Action<any>) => void,
  // @ts-ignore (it's not happy that P can be A)
  fn?: (...args: A) => P
): (...args: A) => void;
function useDispaction<A extends any[], P>(
  typeOrActionCreator: ((...args: A) => Optional<Action<P>>) | string,
  dispatch?: (action: Action<any>) => void,
  fn?: (...args: A) => P
): (...args: A) => void {
  const cDispatch = dispatch !== undefined ? dispatch : useDispatch();
  return useCallback(
    (...args: A) => {
      const action =
        typeof typeOrActionCreator === "string"
          ? {
              type: typeOrActionCreator,
              payload: fn ? fn(...args) : undefined, // Provide default value here
            }
          : typeOrActionCreator(...args);
      action && cDispatch(action);
    },
    [cDispatch, typeOrActionCreator, fn]
  );
}

export default useDispaction;
