const ucFirst = (str: string) =>
  str.length ? `${str[0].toUpperCase()}${str.slice(1)}` : str;

export default ucFirst;
