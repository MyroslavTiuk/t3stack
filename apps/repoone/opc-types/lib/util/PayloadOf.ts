export type PayloadOf<
  A extends (...args: any[]) => { payload: any }
> = ReturnType<A>['payload'];
