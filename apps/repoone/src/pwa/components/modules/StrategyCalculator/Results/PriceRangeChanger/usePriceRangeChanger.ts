import { useStrategyCalculator } from "../../StrategyCalculator.container";
import { useSession } from "../../../Session/SessionProvider";
import isStrategyComplete from "../../../../../../utils/Finance/isStrategyComplete";
import getNearestExpiry from "../../../../../../utils/Finance/getNearestExpiry";
import timeTilExpiry from "../../../../../../utils/Time/timeTilExpiry";
import { getDefaultPriceRange } from "../../../../../../services/calculate/helpers/getPriceRangeOfStrategy";

export const usePriceRangeChanger = () => {
  const { currentCalc } = useStrategyCalculator();
  const currentPriceRange = {
    min: currentCalc?.priceRange[0]
      ? currentCalc?.priceRange[0].toString()
      : null,
    max: currentCalc?.priceRange[1]
      ? currentCalc?.priceRange[1].toString()
      : null,
  };
  const {
    userData: {
      userSettings: { timeDecayBasis },
    },
  } = useSession();

  if (!currentCalc || !isStrategyComplete(currentCalc)) {
    return {
      defaultPriceRange: {
        min: null,
        max: null,
      },
      currentPriceRange,
    };
  }

  const nearestExpiry = getNearestExpiry(currentCalc) as string;
  const timeTilExpiryVal = timeTilExpiry(
    nearestExpiry,
    timeDecayBasis,
    currentCalc.timeOfCalculation
  );

  const dPR = getDefaultPriceRange(
    currentCalc,
    timeTilExpiryVal,
    // @ts-ignore
    nearestExpiry
  );

  return {
    defaultPriceRange: {
      min: dPR[0],
      max: dPR[1],
    },
    currentPriceRange,
  };
};
