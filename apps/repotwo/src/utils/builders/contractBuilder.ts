import { OptionType, Position } from "optionscout-database";
import { type CalculatorOption } from "@utils/calculateProfitEstimates/calculateProfitEstimates";

export function buildContract(contract: Partial<CalculatorOption>) {
  return {
    strikePrice: contract.strikePrice ?? 100,
    optionPrice: contract.optionPrice ?? 10,
    daysToExpiration: contract.daysToExpiration ?? 10,
    position: contract.position ?? Position.Long,
    optionType: contract.optionType ?? OptionType.Put,
    volatility: contract.volatility ?? 10,
    contractsCount: contract.contractsCount ?? 1,
  };
}
