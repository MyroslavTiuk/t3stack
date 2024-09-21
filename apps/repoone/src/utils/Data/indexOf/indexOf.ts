import { type Nullable } from "errable";
import curry from "../../Functional/curry";

function indexOf_<T>(needle: T, haystack: T[]) {
  const idx = haystack.indexOf(needle);
  return idx === -1 ? null : idx;
}

function indexOf<T>(needle: T): (haystack: T[]) => Nullable<number>;
function indexOf<T>(needle: T, haystack: T[]): Nullable<number>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function indexOf<T>(this: any, needle: T, haystack?: T[]) {
  // eslint-disable-next-line prefer-rest-params
  return curry(indexOf_).apply(this, arguments);
}

export default indexOf;
