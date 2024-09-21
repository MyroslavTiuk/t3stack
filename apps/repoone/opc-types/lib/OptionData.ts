export type OptionData = {
  l: number;
  b: number;
  a: number;
  iv: number;
  v: number;
  i: number;
  t?: number;
  g?: number;
  d?: number;
  c?: number;
  // [_] more greeks
};

export type ExpirationDate = {
  date: Date;
};
