import { pick } from "ramda";

import { type Strategy } from "opc-types/lib/Strategy";
import { mapObj } from "../../../../utils/Data";

const transformStrategyForV2 = (legs: Strategy["legsById"]) => {
  return mapObj(
    // @ts-ignore
    pick(["type", "expiry", "iv", "price", "strike", "act", "opType", "num"]),
    legs
  );
};

export default transformStrategyForV2;
