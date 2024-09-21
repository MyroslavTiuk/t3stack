import { mergeDeepLeft } from "ramda";
import { withErr } from "errable";
import { type ErrorData } from "opc-types/lib/api/ErrorData";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import { type StrategyComplete } from "opc-types/lib/Strategy";
import { TIME_DECAY_BASIS } from "../../../types/enums/TIME_DECAY_BASIS";
import {
  MATRIX_TIME_GRANULARITY,
  strategyEstimates,
} from "../../../services/calculate/strategyEstimates";
import { errorDataFactory } from "../../infrastructure/errorHanding";
import { type ReturnType, type DTOValidated } from "./types";

const getBulkCalcRoute = (dto: DTOValidated): ReturnType => {
  const strategies = dto.trades.map((trade) => {
    const strategyDynamicFields = {
      metadata: {
        stratKey: `long-${trade.option.type}`,
      },
      title: `Long ${trade.option.type}}`,
      legsById: {
        underlying: {
          val: trade.stock.symbol,
          curPriceUpdated: trade.stock.priceUpdated,
          curPriceBid: trade.stock.priceBid,
          curPriceAsk: trade.stock.priceAsk,
          curPriceLast: trade.stock.priceLast,
        },
        option: {
          iv: trade.option.iv,
          price: trade.option.price,
          strike: trade.option.strike,
          name: `${trade.option.type} option`,
          opType: `${trade.option.type.toLowerCase()}`,
          expiry: trade.option.expiry,
          num: trade.option.contracts,
        },
      },
      priceRange: trade.priceRange,
      timeOfCalculation: trade.timeOfCalculation,
    };
    return mergeDeepLeft(strategyDynamicFields, baseStrategyTemplate);
  }) as unknown as StrategyComplete[];
  const strategyEstimateResults = strategies.map((s, i) =>
    strategyEstimates(s, {
      timeDecayBasis: TIME_DECAY_BASIS.CALENDAR_DAYS,
      matrixTimeGranularity:
        dto.trades[i].granularity || MATRIX_TIME_GRANULARITY.BEST_FIT,
    })
  );
  const strategyEstimateResultsReturnableErrors = strategyEstimateResults.map(
    withErr<string[], StrategyEstimate, ErrorData>((e) =>
      errorDataFactory(e.join("; "))
    )
  );
  return {
    results: strategyEstimateResultsReturnableErrors,
  };
};

const baseStrategyTemplate = {
  id: null,
  permission: "PRIVATE",
  displayValueType: "PL_DOLLARS",
  // "priceRange": [],
  linkOpTypes: false,
  changeOpType: false,
  linkExpiries: false,
  changeAct: false,
  originalEstimate: null,
  linkNum: false,
  imported: false,
  timeFrame: null,
  matrixSecondaryYAxisType: "DISTANCE_FROM_CURRENT",
  ivShift: null,
  settings: {
    showLinkNum: false,
    inputOptions: ["downside", "initial", "manual"],
    showLinkStrikes: false,
    category: {
      sentiment: "bullish",
    },
    access: "public",
    showLinkOpTypes: false,
    showLinkExpiries: false,
  },
  defaults: {
    linkExpiries: false,
    underlyingElement: "underlying",
  },
  metadata: {
    // "stratKey": string,
    keywords: [],
    category: {
      naked: false,
      married: false,
    },
  },
  // "title": "Long Call",
  linkStrikes: false,
  legs: ["underlying", "option"],
  histIV: 25, // note this only affects Standard deviation calcs
  atmIV: 25, // note this only affects Standard deviation calcs
  underlyingElement: "underlying",
  legsById: {
    underlying: {
      type: "stock",
      act: null,
      name: "Underlying stock",
      num: null,
      linkNum: false,
      // "val": "symbol",
      // "curPriceUpdated": 1687559440695,
      // "curPriceBid": "stockPriceBid",
      // "curPriceAsk": "stockPriceAsk",
      // "curPriceLast": "stockPriceLast",
      price: null,
    },
    option: {
      type: "option",
      // "iv": "optionIv",
      // "price": "optionPrice",
      // "strike": "option.strike",
      // "name": "{fmtOpType(option?.opType || \"Undefined\")} option",
      // "opType": "option?.opType?.toLowerCase?.() || \"Undefined\"",
      // "expiry": "option?.expiry",
      // "num": 1,
      priceRange: null,
      disabled: false,
      act: "buy",
      underlying: "underlying",
      showDetails: false,
      showGreeks: false,
      showExitPrice: false,
      customPrice: false,
      linkNum: false,
    },
  },
  // "timeOfCalculation": 1687559440695
};

export default getBulkCalcRoute;
