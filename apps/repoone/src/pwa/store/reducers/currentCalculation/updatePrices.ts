import { lensPath, lensProp, pipe, set, identity } from "ramda";
import * as E from "errable";

import { type Strategy } from "opc-types/lib/Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type OptionData } from "opc-types/lib/OptionData";
import { type PriceData, type PriceDataSuccess } from "opc-types/lib/PriceData";

import { isStratLegOpt } from "../../../../utils/Finance/Strategy";
import opTypeKey from "../../../../utils/String/opTypeKey/opTypeKey";
import getBestOptionPrice from "../../../../utils/Finance/getBestOptionPrice";
import { matchPrice } from "../../../../utils/Finance/matchPrice";
import getBestOptionPriceRange from "../../../../utils/Finance/getBestOptionPriceRange";

const updatePrices = (
  origState: Strategy,
  workingState: Strategy,
  metaPrices: Nullable<PriceDataSuccess>
) => {
  workingState.legs.forEach((legId) => {
    const updLeg = workingState.legsById[legId];
    const updLegOld = origState.legsById[legId];
    if (isStratLegOpt(updLeg) && isStratLegOpt(updLegOld)) {
      if (
        updLeg?.expiry !== null &&
        updLeg?.strike !== null &&
        updLeg?.opType !== null &&
        (updLeg?.expiry !== updLegOld?.expiry ||
          updLeg?.strike !== updLegOld?.strike ||
          updLeg?.opType !== updLegOld?.opType)
      ) {
        const prevPriceData =
          (isStratLegOpt(updLegOld) &&
            (metaPrices?.options?.[updLegOld.expiry as string]?.[
              opTypeKey(updLegOld.opType || "call")
            ]?.[updLegOld.strike as number] as OptionData)) ||
          undefined;

        const newPriceData =
          (metaPrices?.options?.[updLeg.expiry as string]?.[
            opTypeKey(updLeg.opType || "call")
          ]?.[updLeg.strike as number] as OptionData) || undefined;

        // Update IV
        workingState = pipe(
          () => newPriceData,
          E.ifNotUndefined((newPriceData) =>
            pipe(
              set(lensPath(["legsById", legId, "iv"]), newPriceData.iv),
              set(
                lensProp("timeOfCalculation"),
                (metaPrices as PriceData)?.time
              )
            )(workingState)
          ),
          (mbState) => mbState || workingState
        )();

        // If there are no prices at the new strike in that opType and expiry
        if (newPriceData === undefined) {
          workingState = pipe(
            set(lensPath(["legsById", legId, "iv"]), null),
            set(lensPath(["legsById", legId, "price"]), null),
            set(lensPath(["legsById", legId, "priceRange"]), [null, null]),
            set(lensPath(["legsById", legId, "strike"]), null)
          )(workingState);
        }

        // Clear/update price and priceRange on other param changes
        workingState = pipe(
          () => newPriceData || undefined,
          E.ifNotUndefined((newPriceData) => {
            const legPrice = origState.legsById[legId].price;
            const newLegPrice =
              legPrice === null
                ? getBestOptionPrice(
                    newPriceData,
                    origState.legsById[legId].act || undefined,
                    true
                  )
                : prevPriceData
                ? matchPrice(legPrice, prevPriceData, newPriceData)
                : undefined;
            return !newLegPrice
              ? undefined
              : {
                  price: newLegPrice,
                  priceRange: getBestOptionPriceRange(newPriceData),
                };
          }),
          E.ifNotUndefined(({ price, priceRange }) =>
            pipe(
              !updLeg?.customPrice
                ? set(lensPath(["legsById", legId, "price"]), price)
                : identity,
              set(lensPath(["legsById", legId, "priceRange"]), priceRange)
            )(workingState)
          ),
          (mbState) => mbState || workingState
        )();
      }
    }
  });
  return workingState;
};

export default updatePrices;
