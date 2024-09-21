import { pipe } from 'ramda';

const timeBasedStdDev = (timeSpan: number, curVol: number) => {
  return pipe(
    () => (timeSpan === 0 ? 0 : 1 / timeSpan),
    Math.sqrt,
    (ivDivisor) => curVol / ivDivisor,
    (ivtx) => ivtx / 100,
  )();
};

export default timeBasedStdDev;
