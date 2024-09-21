function ifUndef<X>(expr: X | undefined, fallback: X): X {
  return expr === undefined ? fallback : expr;
}

export default ifUndef;
