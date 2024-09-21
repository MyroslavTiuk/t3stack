function ifNil<X>(expr: X | undefined | null, fallback: X): X {
  return expr === undefined || expr === null ? fallback : expr;
}

export default ifNil;
