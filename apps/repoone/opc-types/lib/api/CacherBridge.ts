import { Outcome } from '../Outcome';

export interface CacherBridge {
  read: <R>(key: string) => Promise<Outcome<R | undefined>>;
  save: <R>(key: string, expiry: number, data: R) => Promise<Outcome<true>>;
}
