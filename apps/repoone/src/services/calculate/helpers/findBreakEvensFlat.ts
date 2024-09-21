import { type PositionEstimateInitial } from "opc-types/lib/PositionEstimate";
import round from "../../../utils/Data/round/round";

/**
 * Note this should only be called when there are no options with time left til expiry (i.e. profit lines between
 * prices are straight.
 */
const findBreakEvensFlat = (
  init: PositionEstimateInitial,
  prices: Record<number, number>,
  crossoverNum = 0
) => {
  const pricePoints = Object.keys(prices)
    .map(parseFloat)
    .sort((a, b) => a - b);
  const bkes = Object.keys(pricePoints)
    .map(parseFloat)
    .reduce<[number, number][]>((bkeAcc, pcPtKey) => {
      if (pcPtKey > pricePoints.length - 2) return bkeAcc;
      const ptOnePricePoint = pricePoints[pcPtKey];
      const ptOnePricePointC = ptOnePricePoint * 100;
      const ptOneGrossC = prices[ptOnePricePoint] * 100 - crossoverNum * 100;
      const ptTwoPricePoint = pricePoints[pcPtKey + 1];
      const ptTwoPricePointC = ptTwoPricePoint * 100;
      const ptTwoGrossC = prices[ptTwoPricePoint] * 100 - crossoverNum * 100;
      const ptOneNetC = ptOneGrossC + init.gross * 100;
      const ptTwoNetC = ptTwoGrossC + init.gross * 100;

      if (
        ptOneNetC === 0 ||
        (ptOneNetC / Math.abs(ptOneNetC)) *
          (ptTwoNetC / Math.abs(ptTwoNetC)) ===
          -1
      ) {
        if (ptTwoNetC === ptOneNetC) {
          // Skip if there's a plateau at the start
          if (pcPtKey === 0) {
            return bkeAcc;
          } else {
            bkeAcc.push([ptOnePricePointC, 0]);
            return bkeAcc;
          }
        } else {
          bkeAcc.push([
            ptOnePricePointC +
              (-ptOneNetC / (ptTwoNetC - ptOneNetC)) *
                (ptTwoPricePointC - ptOnePricePointC),
            ptOneNetC > ptTwoNetC ? -1 : 1,
          ]);
        }
      }
      return bkeAcc;
    }, []);
  return bkes.map<[number, number]>((x) => [round(x[0] / 100, 2), x[1]]);
};

export default findBreakEvensFlat;
