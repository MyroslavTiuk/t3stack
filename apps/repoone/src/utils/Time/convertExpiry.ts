
export function convertExpiryAddDashes(ymd: string) {
  return ymd.length === 8 || ymd.length === 9
    ? `${ymd.substring(0, 4)}-${ymd.substring(4, 6)}-${ymd.substring(6, 9)}`
    : ymd;
}

export function convertExpiryRemoveDashes(ymd: string) {
  return ymd.length === 10 || ymd.length === 11
    ? `${ymd.substring(0, 4)}${ymd.substring(5, 7)}${ymd.substring(8, 11)}`
    : ymd;
}
