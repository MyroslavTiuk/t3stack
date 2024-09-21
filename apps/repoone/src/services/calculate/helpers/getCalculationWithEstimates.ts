import { type StrategyComplete } from "opc-types/lib/Strategy";
import { type TIME_DECAY_BASIS } from "opc-types/lib/TIME_DECAY_BASIS";
import { type CLOSE_PRICE_METHODS } from "opc-types/lib/CLOSE_PRICE_METHODS";
import { recover } from "errable";
import { strategyEstimates } from "../strategyEstimates";
import memoize from "micro-memoize";
// @ts-ignore
import { deepEqual } from "../../../../opc-types/lib/util/deepEqual";
import { type UserData } from "../../../pwa/components/modules/Session/Session.types";

const getCalculationWithEstimatesRaw = (
  calculation: StrategyComplete,
  stockChangeInValue: boolean,
  timeDecayBasis: TIME_DECAY_BASIS,
  closePriceMethod: CLOSE_PRICE_METHODS
) => ({
  calculation,
  estimates: recover(
    null,
    strategyEstimates(calculation as StrategyComplete, {
      stockChangeInValue,
      timeDecayBasis,
      closePriceMethod,
    })
  ),
});
const getCalculationWithEstimatesMem = memoize(getCalculationWithEstimatesRaw, {
  maxSize: 50,
  isEqual: deepEqual,
});

export const getCalculationWithEstimates = (
  calculation: StrategyComplete,
  userData: UserData
) => {
  return getCalculationWithEstimatesMem(
    calculation,
    userData.userSettings.stockChangeInValue,
    userData.userSettings.timeDecayBasis,
    userData.userSettings.closePriceMethod
  );
};
