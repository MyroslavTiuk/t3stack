import { type StratLegStock } from "opc-types/lib/StratLegStock";
import { pipe } from "ramda";
import { ifUndefined } from "errable";
import { type StockData } from "opc-types/lib/StockData";
import round from "../Data/round/round";

const getBestStockPrice = (leg: StratLegStock) =>
  pipe(
    () => leg.price || undefined,
    ifUndefined(
      () => (leg.curPriceLast && round(leg.curPriceLast, 2)) || undefined
    ),
    ifUndefined(() =>
      leg.curPriceAsk && leg.curPriceBid
        ? round((leg.curPriceAsk + leg.curPriceBid) / 2, 2)
        : undefined
    )
  )();

export default getBestStockPrice;

export const getBestStockPriceFromStockData = (
  stockPrice: Pick<StockData, "last" | "bid" | "ask">
) =>
  pipe(
    () => (stockPrice.last && round(stockPrice.last, 2)) || undefined,
    ifUndefined(() =>
      stockPrice.ask && stockPrice.bid
        ? round((stockPrice.ask + stockPrice.bid) / 2, 2)
        : undefined
    )
  )();
