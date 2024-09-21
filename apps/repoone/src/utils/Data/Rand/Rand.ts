// import _ from '_';

export const rand = (min: number, max: number): number => {
  return Math.floor(Math.random() * (1 + max - min)) + min;
};

export const fromArray = <T>(arr: T[]): T => {
  return arr[rand(0, arr.length - 1)];
};
