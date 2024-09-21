export const isThennable = <T>(mbProm: any): mbProm is Promise<T> =>
  mbProm.then && typeof mbProm.then === 'function';
