import { type Action } from "redux";

type ActionCreator<P, A extends any[]> = (...args: A) => {
  type: string;
  payload: P;
};

export function getPayload<P, A extends any[]>(
  actionCreator: ActionCreator<P, A>,
  action: Action
): P {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return action.payload as P;
}
