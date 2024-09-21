/* eslint-disable new-cap */
// tslint:disable-next-line: no-submodule-imports
import { type Strategy } from "opc-types/lib/Strategy";
import * as R from "ramda";
import moment from "moment-timezone";

import sanitizeObjectForUndefined from "../../utils/Functional/sanitizeObjectForUndefined";
import { isStratLegOpt } from "../../utils/Finance/Strategy";

export const getExpiryFirebaseDateFromCalculation = (calculation: Strategy) => {
  return Math.min(
    ...(Object.values(calculation.legsById)
      .map((item): number | false => {
        if (isStratLegOpt(item) && item.expiry) {
          const expirationDateUnix = moment
            .tz(item?.expiry, "America/New_York")
            .unix();
          return expirationDateUnix;
        }
        return false;
      })
      .filter(
        (expirationDateUnixOrFalse) => expirationDateUnixOrFalse !== false
      ) as number[])
  );
};

export default function reduxCalcToFirebaseCalc(reduxCalc: Strategy) {
  const sanitizedObject = sanitizeObjectForUndefined(reduxCalc, null);
  const expiryDate = getExpiryFirebaseDateFromCalculation(reduxCalc);
  const calculationsWithStrippedMetaData = R.evolve(
    {
      metadata: R.pick(["stratKey"]),
    },
    sanitizedObject
  );

  return {
    expiryDate,
    ...calculationsWithStrippedMetaData,
  };
}
