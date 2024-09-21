import { useMemo } from "react";

import { type PriceChoice } from "../../types/PriceChoice";
import ifUndef from "../../../../../../utils/Data/ifUndef/ifUndef";
import { type Strategy } from "opc-types/lib/Strategy";
import { type Nullable } from "opc-types/lib/util/Nullable";

const fmtCalcStateToInput = (
  key: string,
  calc: Nullable<Strategy>,
  priceChoices: PriceChoice[],
  useDefault = false
) => {
  return useMemo(
    () => {
      const defaultVal = useDefault
        ? ifUndef(calc?.defaults[key as keyof Strategy["defaults"]], undefined)
        : undefined;
      switch (key) {
        case "linkOpTypes":
        case "linkStrikes":
          // case 'inputStyle':
          return calc?.[key] || ifUndef(defaultVal, null);

        case "linkNum":
        case "linkExpiries":
          return ifUndef(calc?.[key], true);
      }
    },
    // @ts-ignore (it will just be undefined if not found)
    [key, calc?.[key], calc?.defaults[key]]
  );
};

export default fmtCalcStateToInput;
