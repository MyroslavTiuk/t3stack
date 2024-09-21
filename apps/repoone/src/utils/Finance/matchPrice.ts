import round from "../Data/round/round";
import CentsMath from "../CentsMath/CentsMath";
import calcMid from "./calcMid";

type OpPriceData = {
  b?: number;
  a?: number;
  l?: number;
};

export function matchPrice(
  price: number,
  prevPriceData: OpPriceData,
  newPriceData: OpPriceData
) {
  const prevPricePos = Math.max(
    0,
    Math.min(
      1,
      !(prevPriceData.b && prevPriceData.a)
        ? 0.5
        : prevPriceData.b === price
        ? 0
        : prevPriceData.a === price
        ? 1
        : calcMid(prevPriceData.b, prevPriceData.a) === price
        ? 0.5
        : CentsMath.sub(price, prevPriceData.b) /
          CentsMath.sub(prevPriceData.a, prevPriceData.b)
    )
  );
  return !(newPriceData.b && newPriceData.a)
    ? newPriceData.l || undefined
    : round(
        newPriceData.b + (newPriceData.a - newPriceData.b) * prevPricePos,
        2
      );
}
