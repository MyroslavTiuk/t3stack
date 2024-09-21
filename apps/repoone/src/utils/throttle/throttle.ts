const throttle = <A extends any[], F extends Function>(
  fn: F,
  delay: number,
) => {
  let canCall = true;
  return (...args: A) => {
    if (canCall) {
      fn.apply(null, args);
      canCall = false;
      setTimeout(() => {
        canCall = true;
      }, delay);
    }
  };
};

export default throttle;
