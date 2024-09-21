import { map, pipe, reduce, pick } from "ramda";
import * as E from "errable";

import { type Nullable } from "opc-types/lib/util/Nullable";

import { type Strategy } from "opc-types/lib/Strategy";
import { type StratLeg } from "opc-types/lib/StratLeg";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";
import newYorkTime from "../Time/newYorkTime";
import { isStratLegStock } from "./Strategy";
import selectUnderlyingLeg from "../../pwa/store/selectors/currentCalculation/selectUnderlyingLeg";

const validateOptLeg = (leg: StratLegOpt): E.Errable<string, true> => {
  return pipe(
    () =>
      leg.disabled ||
      (E.notNull(leg.act) &&
        E.notNull(leg.opType) &&
        E.notNull(leg.expiry) &&
        E.notNull(leg.strike) &&
        E.notNull(leg.iv) &&
        E.notNull(leg.num) &&
        E.notNull(leg.price))
        ? (true as const)
        : E.err(`${leg.name} missing fields`),
    E.ifNotErr(() =>
      !isNaN(newYorkTime(leg.expiry || ""))
        ? (true as const)
        : E.err(`${leg.name} invalid expiry`)
    )
  )();
};

const validateStockLeg = (): E.Errable<string, true> => {
  return true;
};

const validateLeg = (leg: StratLeg): E.Errable<string, true> => {
  if (leg.type === "stock") return validateStockLeg();
  if (leg.type === "option") return validateOptLeg(leg);
  else return E.err("Incompatible option leg type");
};

const validateStrategy = (
  nStrat: Nullable<Strategy>
): E.Errable<string[], true> => {
  return pipe(
    E.fromNull<string[], Strategy>(["No strategy"]),
    E.withNotErr((strat) => {
      const newLegs = strat.legs.filter(function (legId) {
        const l = strat.legsById[legId];
        return isStratLegStock(l) || !l.disabled;
      });
      return {
        ...strat,
        legs: newLegs,
        legsById: pick(newLegs, strat.legsById),
      };
    }),
    E.ifNotErr((strat) => {
      if (
        strat.legs.length === 1 &&
        !selectUnderlyingLeg(strat)?.settings.allowPurchase
      ) {
        return E.err(["No enabled options legs"]);
      }
      return strat;
    }),
    E.withNotErr((strat) =>
      map((legId) => validateLeg(strat.legsById[legId]), strat.legs)
    ),
    E.ifNotErr((x) => {
      const init = { isErr: false, vals: [] as (string | true)[] };

      return pipe(
        reduce<(typeof x)[0], typeof init>((acc, legVR) => {
          if (acc.isErr && E.isErr(legVR)) {
            // Accumulate a new error
            return {
              isErr: true,
              vals: acc.vals.concat([legVR.message]),
            };
          } else if (!acc.isErr && E.isErr(legVR)) {
            // First error, reset the vals
            return {
              isErr: true,
              vals: [legVR.message],
            };
          } else if (!acc.isErr && E.isVal(legVR)) {
            // No errors yet :. accumulate the vals
            return {
              isErr: false,
              vals: [legVR],
            };
          }
          // Was already an error, this is a val :. bad luck
          return acc;
        }, init),
        (results) => (results.isErr ? E.err(results.vals as string[]) : true)
      )(x);
    })
  )(nStrat);
};

export default validateStrategy;
