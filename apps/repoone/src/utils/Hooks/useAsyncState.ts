import { useState } from "react";
import { type AsyncData } from "opc-types/lib/store/AsyncData";
import { ASYNC_STATUS } from "../../types/enums/ASYNC_STATUS";
import { type Optional } from "opc-types/lib/util/Optional";
import { asyncData } from "../Redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-underscore-dangle
export default function useAsyncState<PromParams extends any[], Response>(
  asyncFn: (...params: PromParams) => Promise<Response>,
  initData?: Optional<Response>
): [AsyncData<Response>, (...params: PromParams) => void] {
  const [state, setState] = useState(asyncData(ASYNC_STATUS.INITIAL, initData));

  function getState(...params: PromParams) {
    setState(asyncData(ASYNC_STATUS.LOADING));
    asyncFn(...params)
      .then((val) => {
        setState(asyncData(ASYNC_STATUS.COMPLETE, val));
      })
      .catch((err) => {
        setState(asyncData(ASYNC_STATUS.ERROR, err));
      });
  }

  return [state, getState];
}
