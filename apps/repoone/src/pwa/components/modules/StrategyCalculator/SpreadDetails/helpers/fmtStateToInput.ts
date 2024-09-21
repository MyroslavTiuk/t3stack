import { always } from "ramda";

import { type SpreadDetailsState } from "../SpreadDetails.props";
import { type Strategy } from "opc-types/lib/Strategy";
import { pipe } from "ramda";
import { ifNotNull, recoverNull } from "errable";
import { codeToExp } from "../../../../../../utils/String/DateFormat/DateFormat";
import getOverarchingNum from "../../../../../../utils/Finance/overarching/getOverarchingNum";
import getOverarchingExpiry from "../../../../../../utils/Finance/overarching/getOverarchingExpiry";
import getOverarchingStrike from "../../../../../../utils/Finance/overarching/getOverarchingStrike";
import getOverarchingOpType from "../../../../../../utils/Finance/overarching/getOverarchingOpType";
import ucFirst from "../../../../../../utils/String/ucFirst/ucFirst";
import formatPrice from "../../../../../../utils/String/formatPrice/formatPrice";

const fmtStateToInput = (
  key: keyof SpreadDetailsState,
  calc: Strategy
): any => {
  switch (key) {
    case "num":
      return pipe(
        () => getOverarchingNum(calc),
        ifNotNull((num) => num.toString()),
        recoverNull(always(""))
      )() as string;

    case "expiry":
      return pipe(
        () => getOverarchingExpiry(calc),
        ifNotNull(codeToExp),
        recoverNull(always(""))
      )();

    case "strike":
      return pipe(
        () => getOverarchingStrike(calc),
        ifNotNull((num) =>
          formatPrice(num, { forceShowCents: true, hideDollar: true })
        ),
        recoverNull(always(""))
      )();

    case "opType":
      return pipe(
        () => getOverarchingOpType(calc),
        ifNotNull(ucFirst),
        recoverNull(always(""))
      )();

    default:
      return (val: any) => val;
  }
};

export default fmtStateToInput;
