const curry = (fn: Function, ...args: any[]) =>
  fn.length <= args.length
    ? fn(...args)
    : (...more: any[]) => curry(fn, ...args, ...more);

export default curry;
