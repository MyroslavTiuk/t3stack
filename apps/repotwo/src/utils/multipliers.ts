export enum Multipliers {
  M = "M",
  B = "B",
  T = "T",
}

export enum MultiplierValues {
  T = 1000000000000,
  B = 1000000000,
  M = 1000000,
}

export function formatWithMultiplier(price: number) {
  const multiplier = getLargestMultiplier(price);
  if (multiplier === undefined) {
    return price.toFixed(1);
  }
  return `${(price / MultiplierValues[multiplier]).toFixed(1)} ${multiplier}`;
}

export function getLargestMultiplier(price: number | undefined) {
  if (price === undefined) {
    return undefined;
  }
  for (const key of Object.keys(MultiplierValues)) {
    const multiplier = MultiplierValues[key as keyof typeof MultiplierValues];
    if (price >= multiplier) {
      return Multipliers[key as keyof typeof Multipliers];
    }
  }
  return Multipliers.M;
}
