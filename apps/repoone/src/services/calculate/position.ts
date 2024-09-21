import { type StrategyComplete } from "opc-types/lib/Strategy";
import {
  type PositionEstimate,
  type PositionEstimateLeg,
} from "opc-types/lib/PositionEstimate";
import { type StratLegOptComplete } from "opc-types/lib/StratLegOpt";
import { type StratLegStockComplete } from "opc-types/lib/StratLegStock";
import { black_scholes } from "./blackScholes";
import round from "../../utils/Data/round/round";
import timeTilExpiry from "../../utils/Time/timeTilExpiry";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { FINANCE } from "../../config/Finance";
import { CLOSE_PRICE_METHODS } from "../../types/enums/CLOSE_PRICE_METHODS";
import { type EstimateConfig } from "./strategyEstimates";
import { PIN_RISK } from "../../types/enums/PIN_RISK";

const optPos = (
  theoPos: TheoPos,
  cfg: Cfg,
  legId: string,
  optLeg: StratLegOptComplete
): PositionEstimateLeg => {
  const timeTilExp =
    theoPos.legTimesTilExpiry?.[legId] ||
    timeTilExpiry(optLeg.expiry, cfg.timeDecayBasis, theoPos.time);
  const blackScholesPrice =
    timeTilExp > 0
      ? black_scholes(
          optLeg.opType === "call",
          theoPos.price,
          optLeg.strike,
          FINANCE.INTEREST_RATE,
          // @ts-ignore
          optLeg.iv * (1 + (theoPos.ivShift || 0)),
          timeTilExp
        )
      : (optLeg.opType === "call" && theoPos.price <= optLeg.strike) ||
        (optLeg.opType === "put" && theoPos.price >= optLeg.strike)
      ? 0
      : round(Math.abs(theoPos.price - optLeg.strike), 4);
  const midOffsetPct =
    cfg.closePriceMethod !== CLOSE_PRICE_METHODS.MARKET
      ? 0
      : (optLeg.priceRange[1] - optLeg.priceRange[0]) /
        2 /
        ((optLeg.priceRange[1] + optLeg.priceRange[0]) / 2);
  const act = optLeg.act === "sell" ? "buy" : "sell"; // todo: reverse for open?
  const closePrice =
    blackScholesPrice * (act === "sell" ? 1 - midOffsetPct : 1 + midOffsetPct);

  const itm =
    (optLeg.opType === "call" && theoPos.price > optLeg.strike) ||
    (optLeg.opType === "put" && theoPos.price < optLeg.strike);

  const blackScholesPriceTrimmed = itm
    ? Math.max(Math.abs(theoPos.price - optLeg.strike), closePrice)
    : closePrice;

  return {
    value: blackScholesPriceTrimmed,
    expiring: timeTilExp <= 0,
    pinRisk: !(optLeg.act === "sell" && timeTilExp <= 0 && !itm)
      ? PIN_RISK.NONE
      : Math.abs((theoPos.price - optLeg.strike) / theoPos.price) <
        cfg.pinRiskWarningPerc
      ? PIN_RISK.HIGH
      : PIN_RISK.LOW,
  };
};

const stockPos = (
  theoPos: TheoPos,
  cfg: Cfg,
  stockLeg: StratLegStockComplete
): PositionEstimateLeg => {
  return {
    value: cfg.stockChangeInValue
      ? theoPos.price - (stockLeg.price || 0)
      : theoPos.price,
    expiring: false,
    pinRisk: PIN_RISK.NONE,
  };
};

type Cfg = Pick<
  EstimateConfig,
  | "stockChangeInValue"
  | "timeDecayBasis"
  | "closePriceMethod"
  | "pinRiskWarningPerc"
>;
type TheoPos = {
  time: number; // as timestamp
  price: number;
  legTimesTilExpiry?: ObjRecord<number>;
  ivShift?: Nullable<number>;
};

// todo: combine this with initialPosition
const position = (
  theoPos: TheoPos,
  cfg: Cfg,
  strat: StrategyComplete,
  toClose = true
): PositionEstimate => {
  const toCloseMult = toClose ? -1 : 1;
  const undLeg = strat.legsById[
    strat.underlyingElement
  ] as StratLegStockComplete;
  const posEst = strat.legs.reduce(
    (legsPos, legId) => {
      const leg = strat.legsById[legId];
      if (
        (leg.type === "stock" && !leg.settings?.allowPurchase) ||
        (leg.type === "option" && leg.disabled) ||
        leg.act === null ||
        leg.num === null ||
        leg.num < 1
      )
        return legsPos;

      const legPos =
        leg.type === "option"
          ? optPos(theoPos, cfg, legId, leg as StratLegOptComplete)
          : leg.type === "stock"
          ? stockPos(theoPos, cfg, leg as StratLegStockComplete)
          : null;
      if (legPos === null) return legsPos;

      // @ts-ignore (it exists)
      legsPos.legs[legId] = legPos;
      legsPos.gross =
        legsPos.gross +
        toCloseMult *
          (leg.num || 1) *
          (leg.type === "option" ? undLeg.contractsPerShare || 100 : 1) *
          100 * // Work in cents
          ((leg.act === "buy" ? -legPos.value : legPos.value) || 0);
      return legsPos;
    },
    {
      gross: 0,
      legs: {},
    }
  );
  posEst.gross = round(posEst.gross / 100, 2);
  return posEst;
};

export default position;
