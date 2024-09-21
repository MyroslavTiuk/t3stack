import { Optional } from '../util/Optional';
import { ASYNC_STATUS } from './ASYNC_STATUS';

export type AsyncData<T> =
  | {
      status: ASYNC_STATUS.INITIAL;
      errors: [];
      data: Optional<T>;
    }
  | {
      status: ASYNC_STATUS.LOADING;
      errors: [];
      data: Optional<T>;
    }
  | {
      status: ASYNC_STATUS.ERROR;
      errors: {}[];
      data: Optional<T>;
    }
  | {
      status: ASYNC_STATUS.COMPLETE;
      errors: [];
      data: T;
    };
