function forceArray<T>(tOrArr: T | T[]) {
  return !Array.isArray(tOrArr) ? [tOrArr] : tOrArr;
}

export default forceArray;
