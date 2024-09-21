import { clone, lensPath, lensProp, pipe, set, view } from "ramda";

import { type Nullable } from "opc-types/lib/util/Nullable";
import { type PriceDataSuccess } from "opc-types/lib/PriceData";
import { type Optional } from "opc-types/lib/util/Optional";
import { type StratLeg } from "opc-types/lib/StratLeg";
import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { type Strategy } from "opc-types/lib/Strategy";
import { type CurrentCalculationState } from "opc-types/lib/store/CurrentCalculationState";
import { TIME_DECAY_BASIS } from "../../../../types/enums/TIME_DECAY_BASIS";

import type calculatorActions from "../../actions/calculator";
import { isStratLegOpt } from "../../../../utils/Finance/Strategy";
import isStrategyComplete from "../../../../utils/Finance/isStrategyComplete";
import { getLegNumMultiplier } from "../helpers/getLegNumMultiplier";
import getOverarchingNum from "../../../../utils/Finance/overarching/getOverarchingNum";
import getBestCurVol from "../../../../utils/Finance/getBestCurVol";
import getNearestExpiry from "../../../../utils/Finance/getNearestExpiry";

import updateLegs from "../helpers/updateLegs";
import { getBestLinkedValue } from "../helpers/getBestLinkedValue";
import strategyEstimateFieldsHaveUpdated from "../helpers/strategyEstimateFieldsHaveUpdated";
import updatePrices from "./updatePrices";
import { getBestStockPriceFromStockData } from "../../../../utils/Finance/getBestStockPrice";

const updateParamReducer = (
  state: CurrentCalculationState,
  { payload }: ReturnType<typeof calculatorActions.updateParam>
) => {
  if (state === null) return null;
  const { legId: payloadLegId } = payload;

  const legId =
    payload.paramChain[0] === "legsById" && payload.paramChain.length >= 2
      ? payload.paramChain[1]
      : null;
  const legParam =
    payload.paramChain[0] === "legsById" && payload.paramChain.length >= 3
      ? payload.paramChain[2]
      : null;

  const calcParam =
    payload.paramChain.length === 1 ? payload.paramChain[0] : null;

  // This immutably updates the state value based on payload.paramChain
  let updatedState =
    legId && ["_SPREAD", "_ALL", "_ALL_OPTIONS"].includes(legId)
      ? clone(state)
      : set(lensPath(payload.paramChain), payload.paramValue, state);

  if ((legId || "").substr(0, 4) === "_ALL") {
    updatedState.legs.forEach((_legId) => {
      if (
        payload.paramChain.length >= 3 &&
        (legId === "_ALL" ||
          (legId === "_ALL_OPTIONS" && isStratLegOpt(state.legsById[_legId])))
      ) {
        updatedState = set(
          lensPath([payload.paramChain[0], _legId, payload.paramChain[2]]),
          payload.paramValue,
          updatedState
        );
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const metaLinkedUpdate: boolean = payload.meta?.linkedUpdate || false;
  const metaPrices: Nullable<PriceDataSuccess> =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    payload.meta?.prices || null;

  // const curLegOld: Optional<StratLeg> = payloadLegId
  //   ? state?.legsById?.[payloadLegId]
  //   : undefined;

  const curLeg: Optional<StratLeg> = payloadLegId
    ? updatedState?.legsById?.[payloadLegId]
    : undefined;

  // If new symbol
  if (
    payloadLegId === state.underlyingElement &&
    payload.paramChain.join("/") ===
      `legsById/${state.underlyingElement}/val` &&
    payload.paramValue !==
      (state.legsById[state.underlyingElement] as StratLegStock).val
  ) {
    const price =
      !!curLeg?.act && metaPrices?.stock
        ? getBestStockPriceFromStockData(metaPrices?.stock)
        : null;

    updatedState = pipe(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      set<Strategy, string>(lensProp("id"), null),
      set(
        lensPath(["legsById", payloadLegId, "curPriceUpdated"]),
        metaPrices?.retrievedTime || null
      ),
      set(
        lensPath(["legsById", payloadLegId, "curPriceBid"]),
        metaPrices?.stock?.bid || null
      ),
      set(
        lensPath(["legsById", payloadLegId, "curPriceAsk"]),
        metaPrices?.stock?.ask || null
      ),
      set(
        lensPath(["legsById", payloadLegId, "curPriceLast"]),
        metaPrices?.stock?.last || null
      ),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      set(lensPath(["legsById", payloadLegId, "price"]), price),
      set(lensPath(["legsById", payloadLegId, "priceRange"]), null),
      set(lensProp("atmIV"), null),
      set(lensProp("histIV"), metaPrices?.stock?.ivHist || null),
      pipe(
        set(lensProp("timeOfCalculation"), null),
        set(lensProp("originalEstimate"), null),
        set(lensProp("priceRange"), [null, null])
        // todo: set underlying buy price, if it's underlying is bought
      )
      // @ts-ignore
    )(updatedState) as Strategy;
    return state.legs.reduce((updatedState_, legId) => {
      const iLeg = state.legsById[legId];
      if (!isStratLegOpt(iLeg)) return updatedState_;
      return pipe(
        (s: Strategy) => set(lensProp("ivShift"), null, s),
        set(lensPath(["legsById", legId, "expiry"]), null),
        set(lensPath(["legsById", legId, "iv"]), null),
        set(lensPath(["legsById", legId, "price"]), null),
        set(lensPath(["legsById", legId, "priceRange"]), [null, null]),
        set(lensPath(["legsById", legId, "num"]), iLeg.defaults?.num || 1),
        set(lensPath(["legsById", legId, "strike"]), null),
        set(
          lensPath(["legsById", legId, "opType"]),
          iLeg.defaults?.opType || null
        )
      )(updatedState_);
    }, updatedState);
  }

  if (payload.paramChain[0] === "iv") {
    if (isStrategyComplete(updatedState, { checkTimeOfCalculation: false })) {
      // todo: Ideally use (prices as PriceData)?.time (not in scope unless it's in .meta because of reduxes siloed concerns)
      updatedState = set(
        lensProp("timeOfCalculation"),
        Date.now(),
        updatedState
      );
    }
  } else if (legParam === "act" && legId) {
    if (
      curLeg &&
      isStratLegOpt(curLeg) &&
      !curLeg.customPrice &&
      curLeg.price &&
      curLeg.priceRange[0] &&
      curLeg.priceRange[1]
    ) {
      const newPrice =
        curLeg.priceRange[0] + (curLeg.priceRange[1] - curLeg.price);
      updatedState = set(
        lensPath(["legsById", legId, "price"]),
        newPrice,
        updatedState
      );
    }
  } else if (legParam === "num") {
    // Update linked legs' `num` property
    updatedState = updateLegs(updatedState, (chkLeg, legId) =>
      legId !== payloadLegId &&
      (isStratLegOpt(chkLeg) ||
        (chkLeg.type === "stock" && chkLeg.settings.allowPurchase)) &&
      updatedState.linkNum &&
      ((payloadLegId &&
        chkLeg.settings.suggestedNumEle?.includes(payloadLegId)) ||
        chkLeg.settings.suggestedNumEle?.includes("ALL") ||
        (chkLeg.settings.suggestedNumEle?.includes("OPTIONS") &&
          curLeg &&
          isStratLegOpt(curLeg)) ||
        metaLinkedUpdate)
        ? {
            ...chkLeg,
            num:
              (payload.paramValue as number) *
              getLegNumMultiplier(chkLeg, payloadLegId),
          }
        : chkLeg
    );
  } else if (calcParam === "linkNum") {
    // todo: this is the same set of conditionals as above (except `updatedState.linkNum` above)
    updatedState = updateLegs(updatedState, (chkLeg, legId) =>
      legId !== payloadLegId &&
      (isStratLegOpt(chkLeg) ||
        (chkLeg.type === "stock" && chkLeg.settings.allowPurchase)) &&
      ((payloadLegId &&
        chkLeg.settings.suggestedNumEle?.includes(payloadLegId)) ||
        chkLeg.settings.suggestedNumEle?.includes("ALL") ||
        metaLinkedUpdate)
        ? {
            ...chkLeg,
            // if turning linked on, update the num too
            num: payload.paramValue
              ? (curLeg?.num || getOverarchingNum(updatedState) || 1) *
                getLegNumMultiplier(chkLeg, payloadLegId)
              : chkLeg.num,
          }
        : chkLeg
    );
  } else if (legParam === "expiry") {
    if (payload.multiStrike && payload.paramValue !== null) {
      const newExpiryArray: string[] = [];
      newExpiryArray.push(payload.paramValue.toString());
      updatedState = updateLegs(
        updatedState,
        (chkLeg: StratLeg, legId: string): StratLeg => {
          // @ts-ignore
          return legId !== payloadLegId &&
            isStratLegOpt(chkLeg) &&
            updatedState.linkExpiries
            ? {
                ...updatedState.legsById[legId],
                // @ts-ignore
                expiry: newExpiryArray.length ? newExpiryArray : null,
              }
            : updatedState.legsById[legId];
        }
      );
    } else {
      updatedState = updateLegs(
        updatedState,
        (chkLeg: StratLeg, legId: string) =>
          legId !== payloadLegId &&
          isStratLegOpt(chkLeg) &&
          updatedState.linkExpiries
            ? {
                ...updatedState.legsById[legId],
                expiry: payload.paramValue
                  ? (payload.paramValue as string)
                  : null,
              }
            : updatedState.legsById[legId]
      );
    }

    if (metaPrices) {
      updatedState = set(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lensPath(["atmIV"]),
        getBestCurVol(
          metaPrices,
          { timeDecayBasis: /* todo */ TIME_DECAY_BASIS.CALENDAR_DAYS },
          getNearestExpiry(updatedState) || undefined
        ),
        updatedState
      );
    }
  } else if (calcParam === "linkExpiries") {
    updatedState = updateLegs(updatedState, (chkLeg: StratLeg, legId: string) =>
      legId !== payloadLegId && isStratLegOpt(chkLeg)
        ? {
            ...updatedState.legsById[legId],
            linkExpiries: payload.paramValue,
            // if turning linked on, update the expiry too
            expiry: payload.paramValue
              ? getBestLinkedValue(
                  updatedState,
                  payloadLegId,
                  legId,
                  "expiry",
                  payload.paramValue
                )
              : chkLeg.expiry,
          }
        : updatedState.legsById[legId]
    );
    if (metaPrices) {
      updatedState = set(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lensPath(["atmIV"]),
        getBestCurVol(
          metaPrices,
          { timeDecayBasis: /* todo */ TIME_DECAY_BASIS.CALENDAR_DAYS },
          getNearestExpiry(updatedState) || undefined
        ),
        updatedState
      );
    }
  } else if (legParam === "strike") {
    updatedState = updateLegs(
      updatedState,
      // @ts-ignore
      (chkLeg: StratLeg, legId: string) => {
        if (payload.multiStrike) {
          return legId !== payloadLegId && isStratLegOpt(chkLeg)
            ? {
                ...updatedState.legsById[legId],
                strike: payload.paramValue
                  ? [payload.paramValue]
                  : [chkLeg.strike],
              }
            : updatedState.legsById[legId];
        } else {
          return legId !== payloadLegId &&
            isStratLegOpt(chkLeg) &&
            updatedState.linkStrikes
            ? {
                ...updatedState.legsById[legId],
                strike: payload.paramValue
                  ? (payload.paramValue as number)
                  : chkLeg.strike,
              }
            : updatedState.legsById[legId];
        }
      }
    );
  } else if (calcParam === "linkStrikes") {
    updatedState = updateLegs(updatedState, (chkLeg: StratLeg, legId: string) =>
      legId !== payloadLegId && isStratLegOpt(chkLeg)
        ? {
            ...updatedState.legsById[legId],
            linkStrikes: payload.paramValue,
            // if turning linked on, update the num too
            strike: payload.paramValue
              ? getBestLinkedValue(
                  updatedState,
                  payloadLegId,
                  legId,
                  "strike",
                  payload.paramValue
                )
              : chkLeg.strike,
          }
        : updatedState.legsById[legId]
    );
  } else if (legParam === "opType") {
    updatedState = updateLegs(updatedState, (chkLeg: StratLeg, legId: string) =>
      legId !== payloadLegId &&
      isStratLegOpt(chkLeg) &&
      updatedState.linkOpTypes
        ? {
            ...updatedState.legsById[legId],
            opType: payload.paramValue
              ? (payload.paramValue as typeof chkLeg.opType)
              : chkLeg.opType,
          }
        : updatedState.legsById[legId]
    );
  } else if (calcParam === "linkOpTypes") {
    updatedState = updateLegs(updatedState, (chkLeg: StratLeg, legId: string) =>
      legId !== payload.legId && isStratLegOpt(chkLeg)
        ? {
            ...updatedState.legsById[legId],
            linkOpTypes: payload.paramValue,
            // if turning linked on, update the num too
            opType: payload.paramValue
              ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore (TEMP ONLY)
                getBestLinkedValue(
                  updatedState,
                  payload.legId,
                  legId,
                  "opType",
                  payload.paramValue
                )
              : chkLeg.opType,
          }
        : updatedState.legsById[legId]
    );
  }

  /**
   * When updating some option params, try to update the price to match the corresponding updated value
   * for both the changed leg, as well as any legs linked to the changed leg
   */
  if (
    // isPriceData(metaPrices?.options) &&
    metaLinkedUpdate ||
    ["strike", "expiry", "opType"].includes(legParam || "") ||
    (["linkExpiries", "linkStrikes", "linkOpTypes", "linkNum"].includes(
      payload.paramChain[0]
    ) &&
      payload.paramValue !== view(lensPath(payload.paramChain), state))
  ) {
    updatedState = updatePrices(state, updatedState, metaPrices);
  }
  if (strategyEstimateFieldsHaveUpdated(state, updatedState)) {
    // Update updatedState.originalSummary here
  }

  return updatedState;
};

export default updateParamReducer;
