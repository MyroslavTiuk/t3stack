import { type Option, OptionType, type Position } from "optionscout-database";
import { type CalculatorOption } from "./calculateProfitEstimates/calculateProfitEstimates";
import { type OptionsContract } from "./tdApiTypes";

export function optionContractToCalculatorOption(
  optionContract: OptionsContract,
  position: Position,
  contractsCount: number
): CalculatorOption {
  return {
    position,
    contractsCount,
    optionPrice: optionContract.mark,
    strikePrice: optionContract.strikePrice,
    volatility: optionContract.volatility,
    daysToExpiration: optionContract.daysToExpiration,
    delta: optionContract.delta,
    gamma: optionContract.gamma,
    theta: optionContract.theta,
    optionType:
      optionContract.putCall === "CALL" ? OptionType.Call : OptionType.Put,
  };
}

export function scannerOptionToCalculatorOption(
  optionContract: Option,
  position: Position,
  contractsCount: number
): CalculatorOption {
  return {
    position,
    contractsCount,
    optionPrice: optionContract.price,
    strikePrice: optionContract.strikePrice,
    volatility: optionContract.iv,
    daysToExpiration: optionContract.daysToExpiration,
    delta: optionContract.delta,
    gamma: optionContract.gamma,
    theta: optionContract.theta,
    optionType: optionContract.optionType,
  };
}
