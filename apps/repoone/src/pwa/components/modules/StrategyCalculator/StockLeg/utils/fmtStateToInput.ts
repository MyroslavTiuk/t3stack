import { useMemo } from "react";
import { pipe } from "ramda";
import { recoverUndefined } from "errable";

import { type StratLegStock } from "opc-types/lib/StratLegStock";
import formatPrice from "../../../../../../utils/String/formatPrice/formatPrice";
import ifUndef from "../../../../../../utils/Data/ifUndef/ifUndef";
import ifNil from "../../../../../../utils/Data/ifNil/ifNil";
import optionableStocks from "../../../../../../model/optionableStocks";

export const valFmtStateToInput = (val: string) =>
  pipe(
    () =>
      optionableStocks.find(
        (stockData) => stockData[0].toLowerCase() === val.toLowerCase()
      ),
    recoverUndefined(() => [val, ""] as [string, string]),
    ([code, desc]) => `${code}${desc ? " - " : ""}${desc}`
  )();

const fmtStateToInput = (
  key: keyof (StratLegStock & { linkNum: boolean }),
  leg: StratLegStock & { linkNum: boolean },
  useDefault = false
) => {
  return useMemo(
    () => {
      const defaultVal = useDefault
        ? ifUndef(
            leg.defaults[key as keyof StratLegStock["defaults"]],
            undefined
          )
        : undefined;
      switch (key) {
        case "name":
        case "num":
          return String(
            leg[key] || ifUndef(defaultVal as unknown as string, "")
          );

        case "val":
          return valFmtStateToInput(leg.val);

        case "act":
          return pipe(
            () =>
              String(leg[key] || ifNil(defaultVal as unknown as string, "")),
            // @ts-ignore (toUpperCase will be available)
            (s) => (!s.length ? "" : `${s[0].toUpperCase()}${s.slice(1)}`)
          )();

        case "price":
          return leg[key] !== null
            ? `${formatPrice(leg[key] || 0, { hideDollar: true })}`
            : "";

        case "linkNum":
          return ifUndef(leg[key], true);
      }
    },
    // @ts-ignore (it will just be undefined if not found)
    [key, leg[key], leg.defaults[key]]
  );
};

export default fmtStateToInput;
