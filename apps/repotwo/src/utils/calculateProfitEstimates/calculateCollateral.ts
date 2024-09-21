import { OptionType, Position } from "optionscout-database";
import { type CalculatorOption } from "./calculateProfitEstimates";

export type CalculateCollateral = {
  contracts: CalculatorOption[];
  currentStockPrice: number;
};

export function calculateCashSecuredPut({ contracts }: CalculateCollateral) {
  return contracts[0].strikePrice * contracts[0].contractsCount * 100;
}

export function calculateShortPutSpread({ contracts }: CalculateCollateral) {
  if (contracts.length < 2) {
    return 0;
  }
  const writePut =
    contracts[0].position === Position.Short ? contracts[0] : contracts[1];
  const longPut =
    contracts[0].position === Position.Long ? contracts[0] : contracts[1];
  const strikeDifference = Math.abs(writePut.strikePrice - longPut.strikePrice);
  const credit = writePut.optionPrice - longPut.optionPrice;

  return (strikeDifference - credit) * contracts[0].contractsCount * 100;
}

export function calculateShortPutButterfly({ contracts }: CalculateCollateral) {
  if (contracts.length < 4) {
    return 0;
  }
  const sortedStrikePrices = contracts
    .map((contract) => contract.strikePrice)
    .sort((a, b) => b - a);
  return (
    (sortedStrikePrices[0] - sortedStrikePrices[1]) *
    contracts[0].contractsCount *
    100
  );
}

export function calculateNakedPut({
  contracts,
  currentStockPrice,
}: CalculateCollateral) {
  // formula taken from
  // https://support.tastyworks.com/support/solutions/articles/43000435177-naked-short-put?_sp=6b58902e-af7a-4c41-93fc-6cc372cdef5d.1663070511292
  const contract = contracts[0];
  const otm = currentStockPrice - contract.strikePrice;
  const collateral1 = 0.2 * currentStockPrice - otm + contract.optionPrice;
  const collateral2 = 0.1 * contract.strikePrice + contract.optionPrice;

  return (
    Math.max(collateral1, collateral2, 2.5) * contract.contractsCount * 100
  );
}

export function calculateShortCallSpread({ contracts }: CalculateCollateral) {
  if (contracts.length < 2) {
    return 0;
  }
  const writeCall =
    contracts[0].position === Position.Short ? contracts[0] : contracts[1];
  const longCall =
    contracts[0].position === Position.Long ? contracts[0] : contracts[1];
  const strikeDifference = Math.abs(
    writeCall.strikePrice - longCall.strikePrice
  );
  const credit = writeCall.optionPrice - longCall.optionPrice;

  return (strikeDifference - credit) * contracts[0].contractsCount * 100;
}

export function calculateShortCallButterfly({
  contracts,
}: CalculateCollateral) {
  if (contracts.length < 4) {
    return 0;
  }
  const sortedStrikePrices = contracts
    .map((contract) => contract.strikePrice)
    .sort((a, b) => a - b);
  return (
    (sortedStrikePrices[1] - sortedStrikePrices[0]) *
    contracts[0].contractsCount *
    100
  );
}

export function calculateNakedCall({
  contracts,
  currentStockPrice,
}: CalculateCollateral) {
  const contract = contracts[0];
  const otm = contract.strikePrice - currentStockPrice;
  const collateral1 = 0.2 * currentStockPrice - otm + contract.optionPrice;
  const collateral2 = 0.1 * currentStockPrice + contract.optionPrice;

  return (
    Math.max(collateral1, collateral2, 2.5) * contracts[0].contractsCount * 100
  );
}

export function calculateShortStraddle({
  contracts,
  currentStockPrice,
}: CalculateCollateral) {
  // see https://www.tdameritrade.com/retail-en_us/resources/pdf/AMTD086.pdf page 17
  if (contracts.length < 2) {
    return 0;
  }
  const callOption =
    contracts[0].optionType === OptionType.Call ? contracts[0] : contracts[1];
  const putOption =
    contracts[0].optionType === OptionType.Put ? contracts[0] : contracts[1];

  const otmCall = Math.max(callOption.strikePrice - currentStockPrice, 0);
  const callCollateral =
    0.2 * currentStockPrice - otmCall + callOption.optionPrice;

  const otmPut = Math.max(currentStockPrice - putOption.strikePrice, 0);
  const putCollateral =
    0.2 * currentStockPrice - otmPut + putOption.optionPrice;

  return callCollateral > putCollateral
    ? (callCollateral + putOption.optionPrice) *
        contracts[0].contractsCount *
        100
    : (putCollateral + callOption.optionPrice) *
        contracts[0].contractsCount *
        100;
}

export function calculateCoveredStrangle({
  contracts,
  currentStockPrice,
}: CalculateCollateral) {
  if (contracts.length < 2) {
    return 0;
  }
  const putOption =
    contracts[0].optionType === OptionType.Put ? contracts[0] : contracts[1];
  const premium = contracts[0].optionPrice + contracts[1].optionPrice;
  return (
    (currentStockPrice - premium + putOption.strikePrice) *
    contracts[0].contractsCount *
    100
  );
}

export function calculateShortStrangle({
  contracts,
  currentStockPrice,
}: CalculateCollateral) {
  return calculateShortStraddle({
    contracts,
    currentStockPrice,
  });
}

export function calculateIronCondor({ contracts }: CalculateCollateral) {
  const writeCall = contracts.find(
    (contract) =>
      contract.position === Position.Short &&
      contract.optionType === OptionType.Call
  );
  const longCall = contracts.find(
    (contract) =>
      contract.position === Position.Long &&
      contract.optionType === OptionType.Call
  );
  const writePut = contracts.find(
    (contracts) =>
      contracts.position === Position.Short &&
      contracts.optionType === OptionType.Put
  );
  const longPut = contracts.find(
    (contracts) =>
      contracts.position === Position.Long &&
      contracts.optionType === OptionType.Put
  );
  if (!writeCall || !longCall || !writePut || !longPut) {
    return 0;
  }
  const callDifference = Math.abs(writeCall.strikePrice - longCall.strikePrice);
  const putDifference = Math.abs(writePut.strikePrice - longPut.strikePrice);
  return (
    Math.max(callDifference, putDifference) * contracts[0].contractsCount * 100
  );
}
