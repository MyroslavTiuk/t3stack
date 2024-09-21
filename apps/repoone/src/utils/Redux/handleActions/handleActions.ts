import { type Action } from "opc-types/lib/store/Action";
import {
  handleActions as raHandleActions,
  type ReducerMap,
} from "redux-actions";

type StringableActionCreator<P> =
  | ((payload: P) => Action<P>)
  | (() => Action<void>);

type ActionPair<S, P> = [StringableActionCreator<P>, ReducerFn<S, P>];

type ReducerFn<S, P> = (state: S, payload: P, action: Action<P>) => S;

function handleActions<S>(actions: ActionPair<S, any>[], defaultState: S) {
  return raHandleActions<S, any>(
    actions.reduce((acc, actionPair) => {
      acc[String(actionPair[0])] = (state: S, action: Action<any>) =>
        actionPair[1](state, action.payload, action);
      return acc;
    }, {} as ReducerMap<S, any>),
    defaultState
  );
}

export function handleActionReducer<S, P>(
  actionCreator: string | ActionPair<S, P>[0],
  reducer: ActionPair<S, P>[1]
) {
  return [actionCreator, reducer] as ActionPair<S, P>;
}

export default handleActions;
