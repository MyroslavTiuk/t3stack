import {
  type StratLegOpt,
  type StratLegOptDef,
  type StratLegOptComplete,
} from "./StratLegOpt";
import {
  type StratLegStock,
  type StratLegStockDef,
  type StratLegStockComplete,
} from "./StratLegStock";

export type StratLegDef = StratLegOptDef | StratLegStockDef;

export type StratLeg = StratLegOpt | StratLegStock;

export type StratLegComplete = StratLegOptComplete | StratLegStockComplete;
