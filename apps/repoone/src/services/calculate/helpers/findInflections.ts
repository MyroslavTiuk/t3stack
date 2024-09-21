export const findInflections = (
  minPrices: number[],
  pricePoints: number[],
  infKey?: number,
): [number, number][] => {
  if (infKey && minPrices.length === 1 && minPrices[0] === infKey)
    return [[Infinity, Infinity]];
  else if (minPrices.length === 1) return [[minPrices[0], minPrices[0]]];
  const minPriceKeys = minPrices.map((v) => pricePoints.indexOf(v));
  const minPriceKeySets = minPriceKeys.reduce(
    (acc, k, i) => {
      if (i > 0 && k !== minPriceKeys[i - 1] + 1) {
        return {
          lastSkippedKey: i,
          sets: acc.sets.concat([minPriceKeys.slice(acc.lastSkippedKey, i)]),
        };
      }
      return acc;
    },
    {
      lastSkippedKey: 0,
      sets: [] as number[][],
    },
  );
  const minPriceKeySets2 = minPriceKeySets.sets.concat([
    minPriceKeys.slice(minPriceKeySets.lastSkippedKey, minPriceKeys.length),
  ]);

  const minPriceSets = minPriceKeySets2.map((pkSet): [number, number] => {
    return infKey && pricePoints[pkSet[pkSet.length - 1]] === infKey
      ? [pricePoints[pkSet[0]], Infinity]
      : [pricePoints[pkSet[0]], pricePoints[pkSet[pkSet.length - 1]]];
  }) as [number, number][];
  return minPriceSets as [number, number][];
};
