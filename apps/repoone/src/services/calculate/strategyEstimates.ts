import { type Errable, notUndefined } from "errable";

import { type StrategyComplete } from "opc-types/lib/Strategy";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import { type TIME_DECAY_BASIS } from "../../types/enums/TIME_DECAY_BASIS";
import { FINANCE } from "../../config/Finance";

import initialPosition from "./initialPosition";
import summary from "./helpers/summary";
import theoPositions from "./theoPositions";
import { CLOSE_PRICE_METHODS } from "../../types/enums/CLOSE_PRICE_METHODS";
import memoize from "micro-memoize";
import { isStratLegOpt } from "../../utils/Finance/Strategy";
import { deepEqual } from "../../../opc-types/lib/util/deepEqual/utils";

type EstimateConfigDefaultable = {
  interestRate: number; // %
  maxDate: string;
  stockChangeInValue: boolean;
  closePriceMethod: CLOSE_PRICE_METHODS;
  pinRiskWarningPerc: number;
  skipTheoPoints: boolean;
  ivHist?: number;
  minDate?: string;
  matrixTimeGranularity?: MATRIX_TIME_GRANULARITY;
  // todo: add graph price range
};
type EstimateConfigReq = {
  timeDecayBasis: TIME_DECAY_BASIS;
};
export type EstimateConfig = EstimateConfigDefaultable & EstimateConfigReq;

export enum MATRIX_TIME_GRANULARITY {
  BEST_FIT = "BEST_FIT",
  FORTNIGHTLY_MONTHLY = "FORTNIGHTLY_MONTHLY",
}

const strategyEstimatesPureRaw = (
  strat: StrategyComplete,
  cfg: EstimateConfigReq & EstimateConfigDefaultable
): Errable<string[], StrategyEstimate> => {
  const initial = initialPosition(strat, cfg);
  const theoPts = cfg.skipTheoPoints
    ? {}
    : theoPositions(strat, cfg, {
        stockChangeInValue: cfg.stockChangeInValue,
        ...(cfg.matrixTimeGranularity
          ? { matrixTimeGranularity: cfg.matrixTimeGranularity }
          : {}),
        ...(cfg.minDate ? { minDate: cfg.minDate } : {}),
      });
  return {
    initial,
    theoPoints: theoPts || {},
    summary: summary(
      strat,
      initial,
      {
        /* theoPts */
      },
      cfg
    ),
  };
};

const strategyEstimatesPure = memoize(strategyEstimatesPureRaw, {
  maxSize: 50,
  isEqual: deepEqual,
});

export { strategyEstimatesPure };

const configDefaults = {
  interestRate: FINANCE.INTEREST_RATE,
  stockChangeInValue: false,
  closePriceMethod: CLOSE_PRICE_METHODS.MID,
  matrixTimeGranularity: MATRIX_TIME_GRANULARITY.BEST_FIT,
};

const strategyEstimates = (
  strat: StrategyComplete,
  partialCfg: EstimateConfigReq & Partial<EstimateConfigDefaultable>
): Errable<string[], StrategyEstimate> => {
  const cfg = {
    ...configDefaults,
    // This will fallback to the nearest expiring option
    pinRiskWarningPerc: FINANCE.PIN_RISK_WARNING_PERC,
    skipTheoPoints: false,
    maxDate:
      partialCfg.maxDate ||
      (strat.legs.reduce((bestMaxDate, leg) => {
        const theLeg = strat.legsById[leg];
        if (isStratLegOpt(theLeg) && theLeg.disabled) return bestMaxDate;
        // @ts-ignore (this gets checked anyway)
        const legExpiry = strat.legsById[leg]?.expiry;
        return notUndefined(legExpiry) &&
          (bestMaxDate === "" || legExpiry < bestMaxDate)
          ? legExpiry
          : bestMaxDate;
      }, "") as string),
    ...partialCfg,
  };
  return strategyEstimatesPure(strat, cfg);
};

export { strategyEstimates };
