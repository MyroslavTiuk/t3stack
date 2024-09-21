import mapObj from "../mapObj/mapObj";

const copyObjKeys = <T, O extends {}>(objMap: O, key = "key") =>
  mapObj((obj: T, k) => ({
    [key]: k,
    ...obj,
  }))(objMap) as Record<keyof O, T>;

export default copyObjKeys;
