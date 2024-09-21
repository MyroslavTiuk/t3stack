import { useMemo } from "react";

import { type StratLegOpt } from "opc-types/lib/StratLegOpt";
import { type Strategy } from "opc-types/lib/Strategy";
import { expToCode } from "../../../../../../utils/String/DateFormat/DateFormat";
import parseInt10 from "../../../../../../utils/Maths/parseInt10";
import { toRawPrice } from "../../../../../../utils/Data/stripNonNumeric";

const fmtInputToState = (key: keyof StratLegOpt | keyof Strategy) => {
  return useMemo(() => {
    switch (key) {
      case "strike":
      case "price":
        return (val: string) => {
          if (val.length && val[val.length - 1] === ".") return undefined;
          return toRawPrice(val) || null;
        };

      case "opType":
      case "act":
        return (val: string) => (val || "").toLowerCase() || null;

      case "num":
        return (val: string) => parseInt10(val) || null;

      case "expiry":
        return (val: string) => {
          try {
            const slashPos = val.indexOf("/");
            if (slashPos !== -1) {
              const mo = parseInt10(val.substr(0, slashPos));
              const da = parseInt10(val.substr(slashPos + 1));
              const curYr = new Date().getFullYear();
              const curMo = new Date().getMonth() + 1;
              const r = `${curYr + (curMo <= mo ? 0 : 1)}${mo
                .toString()
                .padStart(2, "0")}${da.toString().padStart(2, "0")}`;
              return r;
            }
            return expToCode(val) || null;
          } catch (e) {
            return null;
          }
        };

      default:
        return (val: any) => val;
    }
  }, [key]);
};

export default fmtInputToState;
