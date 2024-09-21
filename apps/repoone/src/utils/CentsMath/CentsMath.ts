const toc = (a: number) => a * 100;
const tod = (a: number) => a / 100;

export const sub = (a: number, b: number) => tod(toc(a) - toc(b));
export const add = (a: number, b: number) => tod(toc(a) + toc(b));
export const mult = (a: number, b: number) => tod(toc(a) * toc(b)) / 100;
export const div = (a: number, b: number) => toc(a) / toc(b);

const CentsMath = {
  sub,
  add,
  mult,
  div,
};

export default CentsMath;
