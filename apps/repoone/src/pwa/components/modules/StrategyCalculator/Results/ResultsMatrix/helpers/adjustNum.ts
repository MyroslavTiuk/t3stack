export const DISP_NEGATIVE_MINIMUM = -0.25;
export const DISP_POSITIVE_MINIMUM = 0.25;

export function adjustNum(num: number, limitRange: [number, number]) {
  return num <= 0
    ? Math.max(-1, num * Math.max(1, DISP_NEGATIVE_MINIMUM / limitRange[0]))
    : num <= 1 || limitRange[1] <= 2
    ? num * Math.max(1, DISP_POSITIVE_MINIMUM / Math.min(2, limitRange[1]))
    : 1 + (num - 1) / (limitRange[1] - 1);
}
