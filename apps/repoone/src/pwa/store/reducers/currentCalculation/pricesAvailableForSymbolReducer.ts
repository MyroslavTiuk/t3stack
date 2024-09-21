import { lensPath, pipe, set, identity, lensProp } from "ramda";
import * as E from "errable";

import { type CurrentCalculationState } from "opc-types/lib/store/CurrentCalculationState";
import { type Strategy } from "opc-types/lib/Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";

import { PRICE_RESULT } from "../../../../types/enums/PRICE_RESULT";
import { TIME_DECAY_BASIS } from "../../../../types/enums/TIME_DECAY_BASIS";

import getBestCurVol from "../../../../utils/Finance/getBestCurVol";
import getNearestExpiry from "../../../../utils/Finance/getNearestExpiry";
import selectUnderlyingLeg from "../../selectors/currentCalculation/selectUnderlyingLeg";
import { getBestStockPriceFromStockData } from "../../../../utils/Finance/getBestStockPrice";
import mapObj from "../../../../utils/Data/mapObj/mapObj";
import { isStratLegOpt } from "../../../../utils/Finance/Strategy";
import opTypeKey from "../../../../utils/String/opTypeKey/opTypeKey";
import { matchPrice } from "../../../../utils/Finance/matchPrice";

import type priceActions from "../../actions/prices";
import updatePrices from "./updatePrices";
import isStrategyComplete from "../../../../utils/Finance/isStrategyComplete";

const pricesAvailableForSymbolReducer = (
  state: CurrentCalculationState,
  { payload }: ReturnType<typeof priceActions.pricesAvailableForSymbol>
) => {
  if (
    payload.result !== PRICE_RESULT.SUCCESS ||
    state === null ||
    !state?.underlyingElement ||
    selectUnderlyingLeg(state)?.val?.toLowerCase() !==
      payload?.symbol?.toLowerCase()
  ) {
    return state;
  }
  return pipe(
    set(
      lensPath(["legsById", state?.underlyingElement, "curPriceLast"]),
      payload.stock.last
    ) as (s: Strategy) => Strategy,
    set(
      lensPath(["legsById", state?.underlyingElement, "curPriceAsk"]),
      payload.stock.ask
    ) as (s: Strategy) => Strategy,
    set(
      lensPath(["legsById", state?.underlyingElement, "curPriceBid"]),
      payload.stock.bid
    ) as (s: Strategy) => Strategy,
    set(
      lensPath(["legsById", state?.underlyingElement, "curPriceUpdated"]),
      Date.now()
    ) as (s: Strategy) => Strategy,
    !selectUnderlyingLeg(state)?.act
      ? identity
      : (set(
          lensPath(["legsById", state?.underlyingElement, "price"]),
          payload.stock.last
        ) as (s: Strategy) => Strategy),
    payload.meta?.autoRefresh === false
      ? identity
      : (updatedState: Strategy) => {
          if (!payload.options) return updatedState;
          const newState = set(
            lensPath(["legsById"]),
            mapObj((val, _) => {
              if (
                !isStratLegOpt(val) ||
                (val.customPrice && !payload.meta?.refreshPriceRangeOnly) ||
                !val.opType ||
                !val.expiry ||
                !val.strike
              )
                return val;

              const newPriceRange = [
                payload.options[val.expiry]?.[opTypeKey(val.opType)]?.[
                  val.strike
                ]?.b ?? null,
                payload.options[val.expiry]?.[opTypeKey(val.opType)]?.[
                  val.strike
                ]?.a ?? null,
              ] as [Nullable<number>, Nullable<number>];
              const legWUpdatedRange = set(
                lensPath(["priceRange"]),
                newPriceRange,
                val
              );
              const newIv =
                payload.options[val.expiry]?.[opTypeKey(val.opType)]?.[
                  val.strike
                ]?.iv;
              const legWUpdatedIv = set(
                lensPath(["iv"]),
                newIv,
                legWUpdatedRange
              );

              return !val.price && !payload.meta?.fillPriceIfBlank
                ? val
                : payload.meta?.refreshPriceRangeOnly &&
                  !payload.meta?.fillPriceIfBlank
                ? legWUpdatedIv
                : set(
                    lensPath(["price"]),
                    matchPrice(
                      val.price,
                      {
                        b: val.priceRange[0] ?? undefined,
                        a: val.priceRange[1] ?? undefined,
                      },
                      {
                        b: newPriceRange[0] ?? undefined,
                        a: newPriceRange[1] ?? undefined,
                      }
                    ),
                    legWUpdatedIv
                  );
            }, updatedState.legsById),
            updatedState
          );

          return !newState.timeOfCalculation &&
            isStrategyComplete(newState, { checkTimeOfCalculation: false })
            ? set(lensProp("timeOfCalculation"), Date.now(), newState)
            : newState;
        },
    (updatedState: Strategy) => {
      return updatePrices(state, updatedState, payload);
    },
    (updatedState: Strategy) =>
      !E.isNull(updatedState.atmIV)
        ? updatedState
        : set(
            lensPath(["atmIV"]),
            getBestCurVol(
              payload,
              { timeDecayBasis: /* todo */ TIME_DECAY_BASIS.CALENDAR_DAYS },
              getNearestExpiry(updatedState) || undefined
            ),
            updatedState
          ),
    (updatedState: Strategy) =>
      !E.isNull(updatedState.histIV)
        ? updatedState
        : set(lensPath(["histIV"]), payload.stock.ivHist, updatedState),
    (updatedState: Strategy) =>
      !selectUnderlyingLeg(updatedState)?.settings.allowPurchase
        ? updatedState
        : set(
            lensPath(["legsById", state?.underlyingElement, "price"]),
            getBestStockPriceFromStockData(payload.stock),
            updatedState
          )
  )(state);
};

export default pricesAvailableForSymbolReducer;
