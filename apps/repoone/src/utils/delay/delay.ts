const delay = <T>(ms: number, resVal?: T): Promise<T> =>
  // @ts-ignore (to fix, use overloads)
  new Promise((r) => setTimeout(() => r(resVal), ms));

export default delay;
