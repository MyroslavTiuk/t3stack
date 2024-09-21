import { nth } from "ramda";

import { type Tuple } from "opc-types/lib/Tuple";

export const checkPairItemMatch = (item: Tuple<string>, textVal: string) =>
  item[1].toLowerCase().includes(textVal.toLowerCase());

export const getPairItemValue = nth(1) as (pair: Tuple<string>) => string;
