import { type Strategy } from "opc-types/lib/Strategy";
import { MATRIX_YAXIS_TYPES } from "../../../../../../../types/enums/MATRIX_YAXIS_TYPES";
import formatPrice from "../../../../../../../utils/String/formatPrice/formatPrice";
import formatPercent from "../../../../../../../utils/String/formatPercent/formatPercent";
import timeTilExpiry from "../../../../../../../utils/Time/timeTilExpiry";
import getNearestExpiry from "../../../../../../../utils/Finance/getNearestExpiry";
import { probability } from "../../../../../../../services/calculate/blackScholes";
import { TIME_DECAY_BASIS } from "../../../../../../../types/enums/TIME_DECAY_BASIS";

interface Props {
  currentCalc: Strategy;
  type: MATRIX_YAXIS_TYPES;
  price: number;
  priceUseDecimal: boolean;
  curPrice: number;
}

const renderYAxisValue = ({
  curPrice,
  price,
  priceUseDecimal,
  currentCalc,
  type,
}: Props) => {
  // todo: TDB fix pass-in
  const timeDecayBasis = TIME_DECAY_BASIS.CALENDAR_DAYS;

  switch (type) {
    case MATRIX_YAXIS_TYPES.STOCK_PRICE:
      return formatPrice(price, {
        hideDollar: true,
        forceShowCents: priceUseDecimal,
      });
    case MATRIX_YAXIS_TYPES.DISTANCE_FROM_CURRENT:
      return formatPercent((price - curPrice) / curPrice);
    case MATRIX_YAXIS_TYPES.PROB_FINISH_OUTSIDE:
      // eslint-disable-next-line no-case-declarations
      const nearestExp = getNearestExpiry(currentCalc);
      // eslint-disable-next-line no-case-declarations
      const { timeOfCalculation } = currentCalc;
      if (!nearestExp || !timeOfCalculation || !currentCalc.atmIV) {
        return null;
      }
      // eslint-disable-next-line no-case-declarations
      const tte = timeTilExpiry(nearestExp, timeDecayBasis, timeOfCalculation);
      // eslint-disable-next-line no-case-declarations
      const probAboveBelow = probability(
        curPrice,
        price,
        tte,
        currentCalc.atmIV
      );
      return formatPercent(
        price > curPrice ? probAboveBelow[0] : probAboveBelow[1]
      );
    case MATRIX_YAXIS_TYPES.PROB_TOUCH:
    default:
      return null;
  }
};

export default renderYAxisValue;
