const getOptionStrikePermutations = (
  strikes: string[],
  legs: string[],
  widthLimit = 1,
  strikeKeys?: number[],
  strikeKeysByStrike?: Record<string, number>,
  knownLegs: Record<string, string> = {},
  legK = 0
): Record<string, string>[] => {
  if (!strikeKeys) strikeKeys = Object.keys(strikes).map((_) => parseFloat(_));
  if (!strikeKeysByStrike)
    strikeKeysByStrike = strikeKeys.reduce(
      (acc, x) => ({ ...acc, [strikes[x]]: x }),
      {}
    );
  const $strikesToMapForLegK =
    legK === 0
      ? strikeKeys
      : strikeKeys.slice(
          strikeKeysByStrike[knownLegs[legs[legK - 1]]],
          strikeKeysByStrike[knownLegs[legs[legK - 1]]] + widthLimit + 1
        );
  return $strikesToMapForLegK.reduce(($acc, $xK) => {
    const $x = strikes[$xK];
    if (legK > 0 && legK !== legs.length && $x <= knownLegs[legs[legK - 1]]) {
      return $acc;
    }
    if (legK >= legs.length) {
      return [knownLegs];
    } else {
      const $thisLegVal = {
        [legs[legK]]: $x,
      };

      return $acc.concat(
        getOptionStrikePermutations(
          strikes,
          legs,
          widthLimit,
          strikeKeys,
          strikeKeysByStrike,
          { ...knownLegs, ...$thisLegVal },
          legK + 1
        )
      );
    }
  }, [] as Record<string, string>[]);
};

export default getOptionStrikePermutations;
