import { useMemo } from "react";

import { type Nullable } from "opc-types/lib/util/Nullable";
import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { type Strategy } from "opc-types/lib/Strategy";

function toRawPrice(str: string): Nullable<number> {
  const attempt = Number(str.replace(/[^.\d]/g, ""));
  return isNaN(attempt) ? null : attempt;
}

const fmtInputToState = (key: keyof StratLegStock | keyof Strategy) => {
  return useMemo(() => {
    switch (key) {
      case "price":
        return (val: string) => toRawPrice(val) || null;

      case "num":
        return (val: string) => parseInt(val) || null;

      case "val":
        return (val: string) =>
          val.substr(
            0,
            val.indexOf(" - ") === -1 ? undefined : val.indexOf(" - ")
          );

      case "act":
      case "linkNum":
      default:
        return (val: any) => val;
    }
  }, [key]);
};

export default fmtInputToState;
