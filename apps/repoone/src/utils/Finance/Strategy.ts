import { type StratLeg, type StratLegComplete } from "opc-types/lib/StratLeg";
import {
  type StratLegOpt,
  type StratLegOptComplete,
} from "opc-types/lib/StratLegOpt";
import {
  type StratLegStock,
  type StratLegStockComplete,
} from "opc-types/lib/StratLegStock";
import { isNumber } from "util";

function isStratLegOpt(leg: StratLegComplete): leg is StratLegOptComplete;
function isStratLegOpt(leg: StratLeg): leg is StratLegOpt;
function isStratLegOpt(leg: StratLeg): leg is StratLegOpt {
  return leg?.type === "option";
}

function isStratLegStock(leg: StratLegComplete): leg is StratLegStockComplete;
function isStratLegStock(leg: StratLeg): leg is StratLegStock;
function isStratLegStock(leg: StratLeg): leg is StratLegStock {
  return leg?.type === "stock";
}

const isStratLegStockComplete = (
  leg: StratLegStock
): leg is StratLegStockComplete => {
  return Boolean(
    leg?.val &&
      ((leg.curPriceAsk && leg.curPriceBid) || leg.curPriceLast) &&
      (leg.act || !leg.settings.allowPurchase) &&
      (isNumber(leg.num) || !leg.settings.allowPurchase)
  );
};

const isStratLegOptComplete = (
  leg: StratLegOpt
): leg is StratLegOptComplete => {
  return Boolean(
    leg.act &&
      leg.iv &&
      leg.expiry &&
      isNumber(leg.num) &&
      leg.strike &&
      leg.opType &&
      leg.underlying &&
      leg.price
  );
};

export {
  isStratLegOpt,
  isStratLegOptComplete,
  isStratLegStock,
  isStratLegStockComplete,
};
