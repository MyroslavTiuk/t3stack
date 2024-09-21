// import { Pronad } from "pronad";
// import { isUndefined } from "util";
// import { Map } from "immutable";

export function mapToObj(strMap: Map<string, string>): Object {
  const obj: { [key: string]: string } = {};
  strMap.forEach((v: string, k: string) => {
    obj[k] = v;
  });
  return obj;
}

export function fill<O1, O2>(obj: O1, dfltObj: O2): O1 & O2 {
  return Object.assign({}, dfltObj, obj);
}

// todo: fix type below
// [k: string] should be [k: AK], but can't get it to go
// function accResultFlat<PK extends keyof O, AK, SR, E, O, R extends (O & {[k: string]: SR})>(
//     keyOpts: { pickKey?: PK, assignKey?: AK },
//     flatFn: (v: O[PK]) => Pronad<E, SR>,
// ): ((v: O) => Pronad<E, R>);
// function accResultFlat<AK extends keyof R, E, SR, O extends object, R = O & {[k: string]: SR}>(
//   keyOpts: { assignKey?: AK, pickKey?: undefined },
//   flatFn: (v: O) => Pronad<E, SR>,
// ): ((v: O) => Pronad<E, R>);
// function accResultFlat<PK extends keyof O, E, O extends object, R, SR, AK extends keyof R>(
//     keyOpts: { pickKey?: PK, assignKey?: undefined },
//     flatFn: (v: O[PK]) => Pronad<E, R>,
// ): ((v: O) => Pronad<E, R>);
// function accResultFlat<PK extends keyof O, E, O extends object, R, SR, AK extends keyof R>(
//     keyOpts: { pickKey?: PK | undefined, assignKey?: AK | undefined },
//     flatFn: ((v: O[PK]) => Pronad<E, R>) | ((v: O[PK]) => Pronad<E, SR>),
// ): ((v: O) => Pronad<E, R>) {
//   if (!isUndefined(keyOpts.pickKey) && !isUndefined(keyOpts.assignKey)) {
//     const ak: AK = keyOpts.assignKey as unknown as AK;
//     return (v: O) => (flatFn as unknown as (v: O[PK]) => Pronad<E, SR>)(v[keyOpts.pickKey]).map((sr: SR) => ({ ...v, [ak]: sr }) as unknown as R);
//   } else if (!isUndefined(keyOpts.pickKey) && isUndefined(keyOpts.assignKey)) {
//     return (v: O) => flatFn(v[keyOpts.pickKey]);
//   } else if (keyOpts.assignKey !== undefined) {
//     const ak: AK = keyOpts.assignKey as unknown as AK;
//     return (v: O) => (flatFn as unknown as (v: O) => Pronad<E, SR>)(v).map((sr: SR) => ({ ...v, [ak]: sr }) as unknown as R);
//   }
//   else throw new Error("accResultFlat used without pickKey or assignKey");
// }

// export { accResultFlat };

export const wrapValue = <K extends keyof T, T extends {}>(key: K) => (
  val: T[K],
) => ({ [key]: val } as T);

export const callWithKey = (pickKey: string) => <V, R>(
  fn: (v: V) => R,
) => (obj: { [key: string]: V }) => fn(obj[pickKey]);

type Optional<T> = T | undefined;

const execFallback = <Obj, Value>(
  fn: (optimisticObj: Required<Obj>) => Optional<Value>,
  defaultVal: Value,
  obj: Obj,
): Value => {
  try {
    const result: Optional<Value> = fn(obj as Required<Obj>);
    return result !== undefined ? result : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

function fallback<Obj, Value>(
  fn: (optimisticObj: Required<Obj>) => Optional<Value>,
  defaultVal: Value,
  obj1: Obj,
): Value;
function fallback<Obj, Value>(
  fn: (optimisticObj: Required<Obj>) => Optional<Value>,
  defaultVal: Value,
): (obj2: Obj) => Value;
function fallback<Obj, Value>(
  fn: (optimisticObj: Required<Obj>) => Optional<Value>,
  defaultVal: Value,
  obj1?: Obj,
) {
  if (obj1 !== undefined) {
    return execFallback<Obj, Value>(fn, defaultVal, obj1);
  }
  return (obj2: Obj): Value => execFallback(fn, defaultVal, obj2);
}

export { fallback };

// WIP, does not type properly:
// const callOn = <R, O extends { [k: K]: (...args: A) => R }, K extends keyof O, A extends any[]>(method: K, args: A) =>
//     (sub: O) => sub[method](args);
