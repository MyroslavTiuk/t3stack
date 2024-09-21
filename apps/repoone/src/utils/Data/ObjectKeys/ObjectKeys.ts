function ObjectKeys<K extends symbol | number | string>(obj: Record<K, any>) {
  return (Object.keys(obj) as unknown) as K[];
}

export default ObjectKeys;
