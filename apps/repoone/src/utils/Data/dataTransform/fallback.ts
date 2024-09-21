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

export default fallback;
