import { useMemo } from "react";
import * as R from "ramda";

import { type Nullable } from "opc-types/lib/util/Nullable";

import { type ExpiryChoice } from "../OptionLeg.props";
import { codeToExp } from "../../../../../../utils/String/DateFormat/DateFormat";
import { type OptionsChain } from "opc-types/lib/OptionsChain";

const useExpiryChoices = (
  prices: Nullable<OptionsChain>,
  useShort = false
): ExpiryChoice[] =>
  useMemo(() => {
    if (!prices) {
      return [];
    }
    return R.pipe(
      Object.keys,
      R.map((exp: string) => ({
        date: codeToExp(exp, useShort),
        dateCode: exp,
      }))
    )(prices);
  }, [prices]);

export default useExpiryChoices;
