import { useCallback } from "react";

import calcActions from "../../../../store/actions/calculator";
import useDispaction from "../../../../../utils/Redux/useDispaction";

const useDispatchUpdateParam = (param: string, meta?: {}) => {
  const updateLeg = useCallback(
    (value: any) =>
      calcActions.updateParam({
        paramChain: [param],
        paramValue: value,
        multiStrike: false,
      }),
    [meta]
  );
  return useDispaction(updateLeg);
};

export default useDispatchUpdateParam;
