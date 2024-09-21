// /!\ Warning, very rough
import { type OptionsChain } from "opc-types/lib/OptionsChain";

export function isPriceData(
  prices: OptionsChain | undefined
): prices is OptionsChain {
  return typeof prices === "object";
}
