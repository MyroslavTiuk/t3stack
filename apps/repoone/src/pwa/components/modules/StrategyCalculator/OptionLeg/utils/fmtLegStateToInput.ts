import { useMemo } from "react";
import { pipe, find } from "ramda";

import { type Optional } from "opc-types/lib/util/Optional";
import { type PriceChoice } from "../../types/PriceChoice";
import { type StratLegOpt } from "opc-types/lib/StratLegOpt";
import formatPrice from "../../../../../../utils/String/formatPrice/formatPrice";
import { codeToExp } from "../../../../../../utils/String/DateFormat/DateFormat";
import ifUndef from "../../../../../../utils/Data/ifUndef/ifUndef";
import ifNil from "../../../../../../utils/Data/ifNil/ifNil";
import ucFirst from "../../../../../../utils/String/ucFirst/ucFirst";

const fmtLegStateToInput = (
  key: string,
  leg: StratLegOpt,
  priceChoices: PriceChoice[],
  useDefault = false,
  isShort = false
) => {
  return useMemo(
    () => {
      const defaultVal = useDefault
        ? ifUndef(leg.defaults[key as keyof StratLegOpt["defaults"]], undefined)
        : undefined;
      switch (key) {
        case "name":
        case "num":
        case "underlying":
          return String(
            leg[key] || ifUndef(defaultVal as unknown as string, "")
          );

        case "act":
        case "opType":
          return pipe(
            () =>
              String(leg[key] || ifNil(defaultVal as unknown as string, "")),
            // @ts-ignore (toUpperCase will be available)
            (s) => (!s.length ? "" : ucFirst(s))
          )();

        case "expiry":
          return leg[key] !== null
            ? codeToExp(leg[key] as string, isShort)
            : "";

        case "price":
          return leg[key] !== null
            ? pipe(
                find((chc: PriceChoice) => chc.price === (leg[key] as number)),
                (mb: Optional<PriceChoice>) =>
                  mb
                    ? `${formatPrice(mb.price, {
                        hideDollar: true,
                        includeThousandSep: false,
                      })}`
                    : // (${
                      //     mb.position
                      //   })`
                      formatPrice(leg[key] as number, {
                        hideDollar: true,
                        includeThousandSep: false,
                      })
              )(priceChoices)
            : "";

        case "strike":
          return leg[key] !== null
            ? formatPrice(leg[key] as number, {
                forceShowCents: true,
                hideDollar: true,
              })
            : "";

        case "iv":
          return leg[key] || null;

        case "disabled":
        case "showDetails":
        case "showGreeks":
        case "showExitPrice":
          return leg[key] || ifUndef(defaultVal, false);
      }
    },
    // @ts-ignore (it will just be undefined if not found)
    [key, leg[key], leg.defaults[key]]
  );
};

export default fmtLegStateToInput;
