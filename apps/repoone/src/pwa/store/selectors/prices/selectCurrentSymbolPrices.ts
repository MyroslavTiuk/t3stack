import { lensProp, pipe, view } from "ramda";
import { ifNotNull } from "errable";

import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { type Store } from "opc-types/lib/store/Store";
import { type Nullable } from "opc-types/lib/util/Nullable";
import { type PriceDataSuccess } from "opc-types/lib/PriceData";
import { PRICE_RESULT } from "../../../../types/enums/PRICE_RESULT";

import selectUnderlyingLeg from "../currentCalculation/selectUnderlyingLeg";
import selectCurrentCalculation from "../currentCalculation/selectCurrentCalculation";
import selectSymbolPrices from "./selectSymbolPrices";

const selectCurrentSymbolPrices = (store: Store): Nullable<PriceDataSuccess> =>
  pipe(
    selectCurrentCalculation,
    ifNotNull(selectUnderlyingLeg),
    ifNotNull(view<StratLegStock, string>(lensProp("val"))),
    ifNotNull((symb) => selectSymbolPrices(symb)(store) || null),
    ifNotNull((prices) =>
      prices.result !== PRICE_RESULT.SUCCESS ? null : prices
    )
  )(store);

export default selectCurrentSymbolPrices;
