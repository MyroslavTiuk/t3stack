import { type FinderOutcome } from "opc-types/lib/api/responses/FinderResp";
import { shouldUseRoiMargin } from "./shouldUseRoiMargin";

import { type DTO } from "../types";

const sortOutcomes = (_: DTO["sortBy"]) => (outcomes: FinderOutcome[]) => {
  return outcomes.sort(
    (a, b) =>
      (shouldUseRoiMargin(b?.vars?.strat?.metadata?.stratKey)
        ? b.roiMargin
        : b.roiMaxRisk) -
      (shouldUseRoiMargin(a?.vars?.strat?.metadata?.stratKey)
        ? a.roiMargin
        : a.roiMaxRisk)
  );
};

export default sortOutcomes;
