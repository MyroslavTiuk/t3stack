function objectFromEntries<K extends string | number, T>(
  iterable: Array<[K, T]>
): Record<K, T> {
  return [...iterable].reduce((obj, [key, val]) => {
    obj[key] = val;
    return obj;
  }, {} as Record<K, T>);
}

export default objectFromEntries;
