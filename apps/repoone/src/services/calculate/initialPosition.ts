import {
  type PositionEstimateInitial,
  type PositionEstimateInitialLeg,
} from "opc-types/lib/PositionEstimate";
import { type StrategyComplete } from "opc-types/lib/Strategy";
import { type StratLegOptComplete } from "opc-types/lib/StratLegOpt";
import { type StratLegStockComplete } from "opc-types/lib/StratLegStock";
import CentsMath from "../../utils/CentsMath/CentsMath";
import { type EstimateConfig } from "./strategyEstimates";

type EstCfgKeys = "stockChangeInValue";
type IPCfg = Pick<EstimateConfig, EstCfgKeys>;

const optPos = (optLeg: StratLegOptComplete): PositionEstimateInitialLeg => ({
  value: optLeg.price,
  act: optLeg.act,
  num: optLeg.num,
});

const stockPos = (
  stockLeg: StratLegStockComplete,
  cfg: IPCfg
): PositionEstimateInitialLeg => ({
  value: cfg.stockChangeInValue ? 0 : stockLeg.price || 0,
  act: stockLeg.act || "buy",
  num: stockLeg.num || 1,
});

const initialPosition = (
  strat: StrategyComplete,
  cfg: IPCfg
): PositionEstimateInitial => {
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
          ? optPos(leg as StratLegOptComplete)
          : leg.type === "stock"
          ? stockPos(leg as StratLegStockComplete, cfg)
          : null;
      if (legPos === null) return legsPos;

      return {
        contractsPerShare: legsPos.contractsPerShare,
        gross:
          legsPos.gross +
          ((legPos.act === "buy" ? -legPos.value : legPos.value) || 0) *
            100 * // Work in cents
            legPos.num *
            (leg.type === "option" ? undLeg.contractsPerShare || 100 : 1),
        legs: {
          ...legsPos.legs,
          [legId]: legPos,
        },
      };
    },
    {
      gross: 0,
      contractsPerShare: undLeg.contractsPerShare || 100,
      legs: {},
    }
  );
  posEst.gross = CentsMath.div(posEst.gross, 100);
  return posEst;
};

export default initialPosition;
