import { map, reduce } from 'ramda';
import newYorkTime from '../../../../utils/Time/newYorkTime';

const getNearestExpiries = ($expiries: string[], $tgtDate: number) => {
  const $expiryTimes = map(newYorkTime, $expiries);
  const $expiryTimesK = Object.keys($expiryTimes).map((_) => parseInt(_, 10));
  const $closestExpiries = reduce(
    function ($best, $k) {
      if (
        ($best[0] === false ||
          $tgtDate - $expiryTimes[$k] < $expiryTimes[$best[0]]) &&
        $tgtDate - $expiryTimes[$k] >= 0
      ) {
        $best[0] = $k;
      }
      if (
        $best[0] !== false &&
        ($best[1] === false ||
          $tgtDate - $expiryTimes[$k] > $expiryTimes[$best[0]]) &&
        $tgtDate - $expiryTimes[$k] <= 0
      ) {
        $best[1] = $k;
      }
      return $best;
    },
    [false, false] as [false | number, false | number],
    $expiryTimesK,
  );

  return {
    prev:
      $closestExpiries[0] === false ? false : $expiries[$closestExpiries[0]],
    prevK: $closestExpiries[0],
    next:
      $closestExpiries[1] === false ? false : $expiries[$closestExpiries[1]],
    nextK: $closestExpiries[1],
  };
};

export default getNearestExpiries;
