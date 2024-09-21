export default function parseQueryObj<T extends { [k: string]: never }>(
  obj: T,
  key: string
) {
  const keyWBraket = `${key}[`;
  return Object.fromEntries(
    Object.keys(obj)
      .filter((k) => k.substr(0, keyWBraket.length) === keyWBraket)
      .map((k) => [k.substring(keyWBraket.length, k.length - 1), obj[k]])
  );
}
