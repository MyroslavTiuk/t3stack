import { type StratLegOptDef } from "opc-types/lib/StratLegOpt";

const createOptionLegDef = (
  name: string,
  opType: null | "call" | "put" = null,
  act: null | "buy" | "sell" = "buy"
): StratLegOptDef => {
  return {
    defaults: {
      act,
      name,
      num: 1,
      opType,
      underlying: "underlying",
    },
    settings: {
      suggestedNumEle: ["ALL"],
    },
    type: "option",
  };
};

export default createOptionLegDef;
