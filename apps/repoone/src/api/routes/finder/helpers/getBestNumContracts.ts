export default function getBestNumContracts(
  _strat: string,
  budgetCost: number | undefined,
  bestValidPrice: number
) {
  // todo, check $strat is a valid case to be checking for budget at this point – I.e. credit spreads would be NA
  if (budgetCost === undefined) return 1;
  const closestNum = Math.round(budgetCost / (bestValidPrice * 100));
  return closestNum === 0
    ? 1
    : closestNum * (100 * bestValidPrice) <= budgetCost
    ? closestNum
    : closestNum >= 2
    ? closestNum - 1
    : 1;
}
