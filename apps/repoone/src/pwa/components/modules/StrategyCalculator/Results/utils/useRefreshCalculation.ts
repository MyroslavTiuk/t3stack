import React from "react";
import * as E from "errable";
import * as R from "ramda";

import { type Nullable } from "opc-types/lib/util/Nullable";
import { type StrategyEstimate } from "opc-types/lib/StrategyEstimate";
import { type Strategy, type StrategyComplete } from "opc-types/lib/Strategy";

import validateStrategy from "../../../../../../utils/Finance/validateStrategy";
import { strategyEstimates } from "../../../../../../services/calculate/strategyEstimates";
import { useSession } from "../../../Session/SessionProvider";

// const DEPENDENT_LEGS_IF_TRUTHY = ['linkNum', 'linkExpiry', 'linkStrike', 'linkOpType'];
const NON_DEPENDENT_LEG_FIELDS = [
  "showDetails",
  "showGreeks",
  "showExitPrice",
  "inputStyle",
  "name",
  "settings",
  "customPrice",
];

const MIN_DEPENDENCY_LENGTH = 123;

const useRefreshCalculation = (
  currentCalc: Nullable<Strategy>
): Nullable<StrategyEstimate> => {
  const { userData } = useSession();

  const deps = [
    // List out all fields from legs that aren't in the NON_DEPENDENT_LEG_FIELDS list
    ...R.reduce(
      (legFields, leg) =>
        legFields.concat(Object.values(R.omit(NON_DEPENDENT_LEG_FIELDS, leg))),
      [],
      Object.values(currentCalc?.legsById || {})
    ),
    ...(currentCalc?.legs || []),
    currentCalc?.ivShift,
    currentCalc?.priceRange?.[0],
    currentCalc?.priceRange?.[1],
  ] as any[];
  const depsPadded = deps.concat(
    Array(Math.max(0, MIN_DEPENDENCY_LENGTH - (deps.length || 0))).fill(
      undefined
    )
  );

  return React.useMemo(
    R.pipe(
      () => E.fromNull(["No strat"], currentCalc),
      E.ifNotErr((_currentCalc) => {
        const validStrat = validateStrategy(_currentCalc);
        return E.isErr(validStrat)
          ? validStrat
          : (_currentCalc as StrategyComplete);
      }),
      E.ifNotErr((_currentCalc) =>
        strategyEstimates(_currentCalc, {
          stockChangeInValue: userData.userSettings.stockChangeInValue,
          timeDecayBasis: userData.userSettings.timeDecayBasis,
          closePriceMethod: userData.userSettings.closePriceMethod,
        })
      ),
      (_) => E.recover(null, _) // this can use curried version
    ),
    depsPadded
  );
};

export default useRefreshCalculation;
