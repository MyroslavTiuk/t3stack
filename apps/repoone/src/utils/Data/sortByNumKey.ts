function sortByNumKey<T>(calls: { [K in string]: T }) {
  return Object.fromEntries(
    Object.entries(calls).sort(
      (a: [string, T], b: [string, T]) => parseFloat(a[0]) - parseFloat(b[0]),
    ),
  );
}

export default sortByNumKey;
