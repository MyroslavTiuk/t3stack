import { type Nullable } from "opc-types/lib/util/Nullable";

type Cfg = {
  preferenceDownForHalf?: boolean;
};

function round(n: number, decimals?: number, prefs?: Cfg): number;
function round(
  n: Nullable<number>,
  decimals?: number,
  prefs?: Cfg
): Nullable<number>;
function round(n: Nullable<number>, decimals = 0, prefs: Cfg = {}) {
  if (n === null) return null;
  const multiplier = Math.pow(10, decimals);
  const rounded = Math.round(n * multiplier) / multiplier;
  if (prefs.preferenceDownForHalf) {
    // if it rounded up and
    round(rounded * multiplier - n * multiplier, 15) === 0.5;
    return Math.floor(n * multiplier) / multiplier;
  }
  return rounded;
}

export default round;
