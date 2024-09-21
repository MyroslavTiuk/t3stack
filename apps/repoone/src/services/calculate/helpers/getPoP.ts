import { probability } from '../blackScholes';

export function getPoP(
  curUndPrice: number,
  t: number,
  breakevens: [number, number][],
  ivHist: number,
) {
  const probs = breakevens.map((be) =>
    probability(curUndPrice, be[0], t, ivHist),
  );
  if (breakevens.length === 1) {
    return breakevens[0][1] === 1 ? probs[0][0] : probs[0][1];
  } else if (
    breakevens.length === 2 &&
    breakevens[0][1] === -1 &&
    breakevens[1][1] === 1
  ) {
    return probs[0][1] + probs[1][0];
  } else if (
    breakevens.length === 2 &&
    breakevens[0][1] === 1 &&
    breakevens[1][1] === -1
  ) {
    return 1 - (probs[0][1] + probs[1][0]);
  }
  return null;
}
