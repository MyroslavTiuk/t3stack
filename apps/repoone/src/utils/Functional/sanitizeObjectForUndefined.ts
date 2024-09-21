import * as R from 'ramda';

export default function sanitizeObjectForUndefined(
  obj: any,
  placeHolderValueForUndefined: any = null,
) {
  if (R.isNil(obj)) {
    return {};
  }
  const newObj: any = {};

  Object.keys(obj).forEach((key) => {
    if (R.isNil(obj[key])) {
      newObj[key] = placeHolderValueForUndefined;
    } else if (obj[key] && typeof obj[key] === 'object') {
      const isArray = obj[key] instanceof Array;
      if (isArray) {
        const newArray = obj[key].map((arrayItem: any) => {
          if (R.isNil(arrayItem)) {
            return placeHolderValueForUndefined;
          }

          if (typeof arrayItem === 'object') {
            return sanitizeObjectForUndefined(
              arrayItem,
              placeHolderValueForUndefined,
            );
          }
          return arrayItem;
        });
        newObj[key] = newArray;
      } else {
        newObj[key] = sanitizeObjectForUndefined(
          obj[key],
          placeHolderValueForUndefined,
        );
      }
    } else {
      newObj[key] = obj[key];
    }
  });

  return newObj;
}
