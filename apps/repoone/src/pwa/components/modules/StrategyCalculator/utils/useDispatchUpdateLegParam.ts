import { useCallback } from "react";
import { flatten, lensPath, view } from "ramda";

import { type Strategy } from "opc-types/lib/Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";
import useDispaction from "../../../../../utils/Redux/useDispaction";
import calcActions from "../../../../store/actions/calculator";

const useDispatchUpdateLegParam = (
  legId?: string,
  curCalc?: Nullable<Strategy>,
  meta?: {}
) => {
  const updateLeg = useCallback(
    (paramChain: string | string[], paramValue: any, updatedMeta?: {}) => {
      return paramValue !== undefined &&
        (legId === "_SPREAD" ||
          view(
            lensPath(
              typeof paramChain === "string" ? [paramChain] : paramChain
            ),
            curCalc || {}
          ) !== paramValue)
        ? calcActions.updateParam({
            legId,
            paramChain: flatten([paramChain]) as string[],
            paramValue,
            meta: updatedMeta || meta,
            multiStrike: false,
          })
        : undefined;
    },
    [legId, curCalc, meta]
  );
  return useDispaction(updateLeg);
};

export default useDispatchUpdateLegParam;
