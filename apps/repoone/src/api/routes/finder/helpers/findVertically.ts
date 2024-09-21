import { last, mergeDeepRight, reduce, uniq } from "ramda";
import { ifNotNull, ifNotUndefined, isUndefined } from "errable";

import { type Nullable } from "opc-types/lib/util/Nullable";
import { type OptionsChain } from "opc-types/lib/OptionsChain";
import { type OptionData } from "opc-types/lib/OptionData";
import {
  type Strategy,
  type StrategyComplete,
  type StrategyDef,
} from "opc-types/lib/Strategy";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";

import getInterestRate from "../../../../services/calculate/helpers/interestRate";
import timeTilExpiry from "../../../../utils/Time/timeTilExpiry";
import summary from "../../../../services/calculate/helpers/summary";
import initialPosition from "../../../../services/calculate/initialPosition";
import position from "../../../../services/calculate/position";

import { find_iv } from "~/services/calculate/blackScholes";

import { type DTO } from "../types";

import { isset } from "./isset";
import get_permutations from "./getPermutations";
import getOptionStrikePermutations from "./getOptionStrikePermutations";
import newYorkTime from "../../../../utils/Time/newYorkTime";
import { type FinderOutcome } from "opc-types/lib/api/responses/FinderResp";

// import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import CentsMath from "../../../../utils/CentsMath/CentsMath";
import isInfinite from "../../../../utils/Data/isInfinite";
import getBestOptionPrice from "../../../../utils/Finance/getBestOptionPrice";
import opTypeKey from "../../../../utils/String/opTypeKey/opTypeKey";
import orUndef from "../../../../utils/Data/orUndef/orUndef";

import { TIME_DECAY_BASIS } from "~/types/enums/TIME_DECAY_BASIS";
import { PREFERENCES } from "~/config/Preferences";
import { FINANCE } from "~/config/Finance";
import { scaleStratToBudget } from "./scaleStratToBudget";
import { trimFreeSpreads } from "./trimFreeSpreads";
import { shouldUseRoiMargin } from "./shouldUseRoiMargin";

function isLiquid($priceSet?: OptionData) {
  return $priceSet && $priceSet.v > 0;
}

function get_legs_by_type($si: StrategyDef) {
  return reduce(
    function ($acc, $eleName) {
      if ($si["legsById"][$eleName]["type"] !== "option") return $acc;
      return {
        ...$acc,
        [$eleName]: isset(
          ($si["legsById"][$eleName]["defaults"] as StratLegOpt)["opType"]
        )
          ? [($si["legsById"][$eleName]["defaults"] as StratLegOpt)["opType"]]
          : ["call", "put"],
      };
    },
    {},
    Object.keys($si["legsById"])
  );
}

/**
 * Currently only looks to optimise for priceFrom
 *  - i.e. does not work with targetting=range or =lt
 */
const RANK_BY = {
  ROI_MARGIN: "ROI_MARGIN",
  ROI_MAX_RISK: "ROI_MAX_RISK",
};
const NUM_RESULTS = 5;

// const ALLOW_DEBUGGING = false;

const findVertically = (
  data: DTO,
  priceInfo: OptionsChain,
  strat: string,
  stratInfo: Strategy
) => {
  const rankBy = shouldUseRoiMargin(strat)
    ? RANK_BY.ROI_MARGIN
    : RANK_BY.ROI_MAX_RISK;
  const legTypes = get_legs_by_type(stratInfo);
  const callPutPerms = get_permutations(legTypes);
  const iRate = getInterestRate();
  const tgtDateTime = newYorkTime(`${data["date"]} 16:00`);
  const targetPrice = data.priceFrom || data.priceTo || 0;

  const now = Date.now();
  const bestOutcomes: FinderOutcome[] = [];

  for (const exp in priceInfo)
    if (Object.prototype.hasOwnProperty.call(priceInfo, exp)) {
      const estimateCfg = {
        maxDate: exp,
        stockChangeInValue: false,
        timeDecayBasis: PREFERENCES.DEFAULT_TIME_DECAY_BASIS,
        closePriceMethod: PREFERENCES.DEFAULT_CLOSE_PRICE_METHOD,
        pinRiskWarningPerc: FINANCE.PIN_RISK_WARNING_PERC,
      };
      const expPriceInfo = priceInfo[exp];

      for (const cppi in callPutPerms)
        if (Object.prototype.hasOwnProperty.call(callPutPerms, cppi)) {
          const callPutPerm = callPutPerms[cppi];
          // const cppK = ALLOW_DEBUGGING ? JSON.stringify(callPutPerm) : "";
          const possStrikes = uniq([
            ...(Object.values(callPutPerm).includes("call")
              ? Object.keys(expPriceInfo?.[opTypeKey.CALL] || {})
              : []),
            ...(Object.values(callPutPerm).includes("put")
              ? Object.keys(expPriceInfo?.[opTypeKey.PUT] || {})
              : []),
          ]);
          const width = 5;
          const strikePerms = getOptionStrikePermutations(
            possStrikes,
            Object.keys(legTypes),
            width
          );
          const t = Math.max(
            0,
            timeTilExpiry(exp, TIME_DECAY_BASIS.CALENDAR_DAYS, now)
          );

          strikePerms.forEach((strikePerm) => {
            // const spK = ALLOW_DEBUGGING
            //   ? Object.values(strikePerm).join(",")
            //   : "";
            // const permIdentifier = [exp, /*cppK, */ spK].join("|");
            const vars = Object.keys(stratInfo["legsById"]).reduce(function (
              acc,
              elName
            ) {
              if (acc === null) return null;
              const el = stratInfo["legsById"][elName];
              if (el["type"] === "stock") {
                return {
                  ...acc,
                  [elName]: {
                    val: data.symbol,
                    price: data["currentPrice"],
                  },
                };
              } else if (isUndefined(callPutPerm[elName])) {
                return acc;
              }
              const opPriceSet =
                expPriceInfo?.[
                  opTypeKey(callPutPerm[elName] as "call" | "put")
                ]?.[strikePerm[elName] as unknown as number];
              const legIlliquid = !isLiquid(opPriceSet);
              // if (!isLiquid(opPriceSet)) return null;

              const act = el["defaults"]["act"] ? el["defaults"]["act"] : "buy";
              const bestValidPrice =
                legIlliquid && act === "buy"
                  ? opPriceSet?.a || undefined
                  : legIlliquid && act === "sell"
                  ? opPriceSet?.b || undefined
                  : ifNotUndefined(
                      (_) => getBestOptionPrice(_, orUndef(act)),
                      opPriceSet
                    );
              if (!bestValidPrice) return null;

              const iv =
                t === 0
                  ? 0
                  : find_iv(
                      callPutPerm[elName] === "call",
                      data["currentPrice"],
                      parseFloat(strikePerm[elName]),
                      iRate,
                      t,
                      bestValidPrice
                    );

              return {
                ...acc,
                [elName]: {
                  ...el,
                  act,
                  price: bestValidPrice,
                  expiry: exp,
                  opType: callPutPerm[elName] as "call" | "put",
                  strike: parseFloat(strikePerm[elName]),
                  iv: iv < 5 ? 5 : iv > 1000 ? 1000 : iv,
                  num: el["defaults"]["num"],
                },
              };
            },
            {} as Nullable<NonNullable<unknown>>);

            if (vars !== null) {
              const stratCmpl1cct = mergeDeepRight(stratInfo, <
                Partial<StrategyComplete>
              >{
                id: null,
                timeFrame: null,
                histIV: ifNotNull(parseFloat, data.ivHist) || null,
                legs: Object.keys(vars),
                legsById: vars,
                timeOfCalculation: Date.now(),
              }) as StrategyComplete;
              const initPos1Cct = initialPosition(stratCmpl1cct, {
                stockChangeInValue: false,
              });
              const stratCmpl = trimFreeSpreads(stratCmpl1cct);
              const sum1Cct = summary(stratCmpl, initPos1Cct, {}, estimateCfg);
              const maxRiskCost =
                rankBy === "ROI_MARGIN" && sum1Cct.collateral
                  ? sum1Cct.collateral
                  : isInfinite(sum1Cct.maxRisk)
                  ? initPos1Cct.gross
                  : Math.min(initPos1Cct.gross, sum1Cct.maxRisk);
              if (
                !data.budgetExclExp ||
                !data.budgetCost ||
                -maxRiskCost < data.budgetCost
              ) {
                const stratCmplInBudget = scaleStratToBudget(
                  data.budgetCost,
                  maxRiskCost,
                  stratCmpl1cct
                );
                if (stratCmplInBudget === null) {
                  return;
                }
                const stratCmpl = trimFreeSpreads(stratCmplInBudget);
                const initPos = initialPosition(stratCmpl, {
                  stockChangeInValue: false,
                });
                const theoFrom = position(
                  {
                    time: tgtDateTime,
                    price: targetPrice,
                  },
                  estimateCfg,
                  stratCmpl
                );

                // if minReturn price is 'i' or 0, this will always be the case for this strategy
                // todo: curVol is hardcoded to 30 (for 1/2 SD profits)
                const maximums = summary(stratCmpl, initPos, {}, estimateCfg);

                const maxRisk = maximums["maxRisk"];
                const net = CentsMath.add(theoFrom["gross"], initPos["gross"]);
                const posRoiMaxRisk =
                  maxRisk == 0
                    ? Infinity
                    : isInfinite(maxRisk)
                    ? 0
                    : CentsMath.div(net, -maxRisk);

                const netMargin = ifNotNull(
                  (m) => CentsMath.add(initPos["gross"], m),
                  maximums.collateral
                );
                const posRoiMargin = ifNotNull(
                  (m) => CentsMath.div(net, -m),
                  netMargin
                );

                // todo: consider tallying best outcomes here with conditional (no reason to loop through again)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (
                  net > 0 &&
                  (bestOutcomes.length < NUM_RESULTS ||
                    (rankBy === RANK_BY.ROI_MAX_RISK &&
                      (posRoiMaxRisk >
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        (last(bestOutcomes)["roiMaxRisk"] as number) ||
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        (last(bestOutcomes)["roiMaxRisk"] === Infinity &&
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          net > (last(bestOutcomes)["net"] || 0)))) ||
                    (rankBy === RANK_BY.ROI_MARGIN &&
                      posRoiMargin !== null &&
                      posRoiMargin >
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        (last(bestOutcomes)["roiMargin"] as number)))
                ) {
                  const theoFrom = position(
                    {
                      time: tgtDateTime,
                      price: targetPrice,
                    },
                    estimateCfg,
                    stratCmpl
                  );

                  // if minReturn price is 'i' or 0, this will always be the case for this strategy
                  // todo: curVol is hardcoded to 30 (for 1/2 SD profits)
                  const maximums = summary(stratCmpl, initPos, {}, estimateCfg);

                  const maxRisk = maximums["maxRisk"];
                  const net = CentsMath.add(
                    theoFrom["gross"],
                    initPos["gross"]
                  );
                  const posRoiMaxRisk =
                    maxRisk == 0
                      ? Infinity
                      : isInfinite(maxRisk)
                      ? 0
                      : CentsMath.div(net, -maxRisk);

                  const netMargin = ifNotNull(
                    (m) => CentsMath.add(initPos["gross"], m),
                    maximums.collateral
                  );
                  const posRoiMargin = ifNotNull(
                    (m) => CentsMath.div(net, -m),
                    netMargin
                  );
                  bestOutcomes.push({
                    vars: {
                      strat: stratCmpl,
                      initPos: initPos,
                      theoPos: theoFrom,
                    },
                    // maxReturn: maximums.maxReturn,
                    // maxReturnPrice: maximums.maxReturnAtPriceOf,
                    net: net,
                    gross: theoFrom["gross"],
                    init: initPos["gross"],
                    maxRisk: maximums["maxRisk"],
                    roiMaxRisk: posRoiMaxRisk,
                    netMargin: netMargin,
                    grossMargin: maximums.collateral,
                    roiMargin: posRoiMargin || 0,
                    pop: maximums.pop,
                  });

                  // todo: consider tallying best outcomes here with conditional (no reason to loop through again)
                  if (
                    net > 0 &&
                    (bestOutcomes.length < NUM_RESULTS ||
                      (rankBy === RANK_BY.ROI_MAX_RISK &&
                        (posRoiMaxRisk >
                          (last(bestOutcomes)["roiMaxRisk"] as number) ||
                          (last(bestOutcomes)["roiMaxRisk"] === Infinity &&
                            net > (last(bestOutcomes)["net"] || 0)))) ||
                      (rankBy === RANK_BY.ROI_MARGIN &&
                        posRoiMargin !== null &&
                        posRoiMargin >
                          (last(bestOutcomes)["roiMargin"] as number)))
                  ) {
                    bestOutcomes.push({
                      vars: {
                        strat: stratCmpl,
                        initPos: initPos,
                        theoPos: theoFrom,
                      },
                      // maxReturn: maximums.maxReturn,
                      // maxReturnPrice: maximums.maxReturnAtPriceOf,
                      net: net,
                      gross: theoFrom["gross"],
                      init: initPos["gross"],
                      maxRisk: maximums["maxRisk"],
                      roiMaxRisk: posRoiMaxRisk,
                      netMargin: netMargin,
                      grossMargin: maximums.collateral,
                      roiMargin: posRoiMargin || 0,
                      pop: maximums.pop,
                    });
                    // Intermittently sort and slice to avoid memory blow-outs
                    // if (bestOutcomes.length >= 500) {
                    //   bestOutcomes.sort(
                    //     rankBy === RANK_BY.ROI_MARGIN
                    //       ? (a, b) => b.roiMargin - a.roiMargin
                    //       : (a, b) => b.roiMaxRisk - a.roiMaxRisk,
                    //   );
                    //   bestOutcomes = bestOutcomes.slice(0, NUM_RESULTS);
                    // }
                  }
                }
              } // /(if (vars === false) )
            }
          });
        }
    }

  return bestOutcomes;
};

export default findVertically;
