import { type AsyncData } from "opc-types/lib/store/AsyncData";
import { type AppErr } from "opc-types/lib/AppErr";
import { ASYNC_STATUS } from "../../../types/enums/ASYNC_STATUS";
import { type Optional } from "opc-types/lib/util/Optional";

export function asyncData<T>(
  status: ASYNC_STATUS.INITIAL,
  data?: Optional<T>,
  _?: Optional<T>
): AsyncData<T>;
export function asyncData<T>(
  status: ASYNC_STATUS.LOADING,
  data?: Optional<T>,
  _?: Optional<T>
): AsyncData<T>;
export function asyncData<T>(
  status: ASYNC_STATUS.COMPLETE,
  data: T,
  _?: Optional<T>
): AsyncData<T>;
export function asyncData<T>(
  status: ASYNC_STATUS.ERROR,
  errors: AppErr[],
  data?: Optional<T>
): AsyncData<T>;
export function asyncData<T>(
  status: ASYNC_STATUS,
  errorsOrData: AppErr[] | T,
  data?: Optional<T>
): AsyncData<T> {
  if (status === ASYNC_STATUS.LOADING) {
    return {
      errors: [],
      status: ASYNC_STATUS.LOADING,
      data: errorsOrData as T,
    };
  }
  if ([ASYNC_STATUS.COMPLETE, ASYNC_STATUS.INITIAL].includes(status)) {
    return {
      errors: [],
      status,
      data: errorsOrData as T,
    };
  }
  return {
    errors: errorsOrData as AppErr[],
    status: ASYNC_STATUS.ERROR,
    data,
  };
}
