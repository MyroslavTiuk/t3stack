import { reduce } from 'ramda';

function get_permutations(
  $legTypeMap: Record<string, string[]>,
  $knownLegs: Record<string, string>[] = [],
  $legK = 0,
): Record<string, string>[] {
  const $legs = Object.keys($legTypeMap);
  if ($legK === $legs.length) return $knownLegs;
  return reduce(
    function ($acc, $x) {
      if ($legK >= $legs.length) {
        return $knownLegs;
      } else {
        const $thisLegVal = { [$legs[$legK]]: $x };

        return $acc.concat(
          get_permutations(
            $legTypeMap,
            { ...$knownLegs, ...$thisLegVal },
            $legK + 1,
          ),
        );
      }
    },
    [] as Record<string, string>[],
    $legTypeMap[$legs[$legK]],
  );
}

export default get_permutations;
