import { useCallback } from "react";

import calcActions from "../../../../store/actions/calculator";
import useDispaction from "../../../../../utils/Redux/useDispaction";

const useDispatchUpdateParamGeneric = (meta?: {}) => {
  const updateLeg = useCallback(
    (paramChain: string[], value: string | number | null) =>
      calcActions.updateParam({
        paramChain,
        paramValue: value,
        multiStrike: false,
      }),
    [meta]
  );
  return useDispaction(updateLeg);
};

export default useDispatchUpdateParamGeneric;
